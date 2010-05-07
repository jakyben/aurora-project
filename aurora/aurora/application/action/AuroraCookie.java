package aurora.application.action;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import aurora.service.ServiceInstance;
import aurora.service.http.HttpServiceInstance;
import uncertain.composite.CompositeMap;
import uncertain.composite.TextParser;
import uncertain.core.ConfigurationError;
import uncertain.proc.AbstractEntry;
import uncertain.proc.ProcedureRunner;

public class AuroraCookie extends AbstractEntry {

	private String name;
	private String value;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	
	public void run(ProcedureRunner runner) throws Exception {

		CompositeMap mContext = runner.getContext();
		HttpServiceInstance mService = (HttpServiceInstance) ServiceInstance
				.getInstance(mContext);
		HttpServletResponse response = mService.getResponse();
		this.setValue  (TextParser.parse(this.getValue(), mContext));
		Cookie cookie = new Cookie(name, value);
		response.addCookie(cookie);

	}

}
