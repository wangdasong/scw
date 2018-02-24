package com.github.wangdasong.scwbasecore.dao.entity.base;

public class TreeDataEntity {
    public enum TypeEnum {
    	FOLDER("folder"), ITEM("item");
    	private String name;
    	private TypeEnum(String name) {
    		this.name = name;
    	}
    	public String getName() {
            return name;  
        }
    }
	protected String name;
	protected TypeEnum type;
	private AdditionalParameters additionalParameters; 
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type.getName();
	}
	public void setTypeEnum(TypeEnum type) {
		this.type = type;
	}
	public TypeEnum getTypeEnum() {
		return type;
	}
	public AdditionalParameters getAdditionalParameters() {
		return additionalParameters;
	}
	public void setAdditionalParameters(AdditionalParameters additionalParameters) {
		this.additionalParameters = additionalParameters;
	}
	
}
