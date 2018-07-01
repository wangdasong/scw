package com.github.wangdasong.scwauthserver.controller;

import org.springframework.context.expression.MapAccessor;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.stereotype.Controller;
import org.springframework.util.PropertyPlaceholderHelper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@SessionAttributes("authorizationRequest")
public class OAuthController {

    /**
     * Simple String template renderer.
     *
     */
    class SpelView implements View {

        private final String template;

        private final String prefix;

        private final SpelExpressionParser parser = new SpelExpressionParser();

        private final StandardEvaluationContext context = new StandardEvaluationContext();

        private PropertyPlaceholderHelper.PlaceholderResolver resolver;

        public SpelView(String template) {
            this.template = template;
            this.prefix = new RandomValueStringGenerator().generate() + "{";
            this.context.addPropertyAccessor(new MapAccessor());
            this.resolver = new PropertyPlaceholderHelper.PlaceholderResolver() {
                public String resolvePlaceholder(String name) {
                    Expression expression = parser.parseExpression(name);
                    Object value = expression.getValue(context);
                    return value == null ? null : value.toString();
                }
            };
        }

        public String getContentType() {
            return "text/html";
        }

        public void render(Map<String, ?> model, HttpServletRequest request, HttpServletResponse response)
                throws Exception {
            Map<String, Object> map = new HashMap<String, Object>(model);
            String path = ServletUriComponentsBuilder.fromContextPath(request).build()
                    .getPath();
            map.put("path", (Object) path==null ? "" : path);
            context.setRootObject(map);
            String maskedTemplate = template.replace("${", prefix);
            PropertyPlaceholderHelper helper = new PropertyPlaceholderHelper(prefix, "}");
            String result = helper.replacePlaceholders(maskedTemplate, resolver);
            result = result.replace(prefix, "${");
            response.setContentType(getContentType());
            response.getWriter().append(result);
        }

    }

    @RequestMapping("/oauth/confirm_access")
    public ModelAndView getAccessConfirmation(Map<String, Object> model, HttpServletRequest request) throws Exception {
        String template = createTemplate(model, request);
        if (request.getAttribute("_csrf") != null) {
            model.put("_csrf", request.getAttribute("_csrf"));
        }
        System.out.println("template ==== " + template);
        return new ModelAndView(new SpelView(template), model);
    }

    protected String createTemplate(Map<String, Object> model, HttpServletRequest request) {
        String template = TEMPLATE;
        if (model.containsKey("scopes") || request.getAttribute("scopes") != null) {
            template = template.replace("%scopes%", createScopes(model, request)).replace("%denial%", "");
        }
        else {
            template = template.replace("%scopes%", "").replace("%denial%", DENIAL);
        }
        if (model.containsKey("_csrf") || request.getAttribute("_csrf") != null) {
            template = template.replace("%csrf%", CSRF);
        }
        else {
            template = template.replace("%csrf%", "");
        }
        return template;
    }

    private CharSequence createScopes(Map<String, Object> model, HttpServletRequest request) {
        StringBuilder builder = new StringBuilder("<ul>");
        @SuppressWarnings("unchecked")
        Map<String, String> scopes = (Map<String, String>) (model.containsKey("scopes") ? model.get("scopes") : request
                .getAttribute("scopes"));
        for (String scope : scopes.keySet()) {
            String approved = "true".equals(scopes.get(scope)) ? " checked" : "";
            String denied = !"true".equals(scopes.get(scope)) ? " checked" : "";
            String value = SCOPE.replace("%scope%", scope).replace("%key%", scope).replace("%approved%", approved)
                    .replace("%denied%", denied);
            builder.append(value);
        }
        builder.append("</ul>");
        return builder.toString();
    }

    private static String CSRF = "<input type='hidden' name='${_csrf.parameterName}' value='${_csrf.token}' />";

    private static String DENIAL = "<form id='denialForm' name='denialForm' action='${path}/oauth/authorize' method='post'><input name='user_oauth_approval' value='false' type='hidden'/>%csrf%<label><input name='deny' value='Deny' type='submit'/></label></form>";

    private static String TEMPLATE = "<html> <body><h1></h1>"
//            + "<p>Do you authorize '${authorizationRequest.clientId}' to access your protected resources?</p>"
            + "<form id='confirmationForm' name='confirmationForm' action='${path}/oauth/authorize' method='post'>" +
            "<input name='user_oauth_approval' value='true' type='hidden'/>" +
            "%csrf%" +
            "%scopes%" +
            "<label>" +
//            "<input name='authorize' value='Authorize' type='submit'/>" +
            "</label></form>"
            + "%denial%</body><script language=javascript> setTimeout('document.confirmationForm.submit()',10) </script></html>";

    private static String SCOPE = "<input type='hidden' name='%key%'"
            + " value='true'></input>";

}
