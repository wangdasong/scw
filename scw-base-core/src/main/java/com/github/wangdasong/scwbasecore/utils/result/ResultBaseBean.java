package com.github.wangdasong.scwbasecore.utils.result;


import com.github.wangdasong.scwbasecore.utils.paging.Pagination;
import net.sf.json.JSONObject;

public abstract class ResultBaseBean<T> {
	public static final int RESULT_STATUS_SUCCESS = 0;
	public static final int RESULT_STATUS_FAILED = 1;

	public ResultBaseBean(T t){
		this.setData(t);
		this.setStatus(0);
		this.setMsg("成功！");
	}
	int status;
	String msg;
	T data;

	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	public JSONObject toJsonBean(){
		return JSONObject.fromObject(this);
	}
}
