package aurora.presentation.component.std;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import uncertain.composite.CompositeLoader;
import uncertain.composite.CompositeMap;
import uncertain.ocm.IObjectRegistry;
import uncertain.ocm.ISingleton;
import aurora.application.AuroraApplication;
import aurora.application.features.IFreeMarkerTemplateProvider;
import aurora.presentation.BuildSession;
import aurora.presentation.IViewBuilder;
import aurora.presentation.ViewContext;
import freemarker.template.Template;

public class FreeMarkerTemplate implements IViewBuilder, ISingleton {
	IObjectRegistry mObjectRegistry;

	public FreeMarkerTemplate(IObjectRegistry rg) {
		this.mObjectRegistry = rg;
	}

	@SuppressWarnings("unchecked")
	public void buildView(BuildSession session, ViewContext view_context) throws IOException, aurora.presentation.ViewCreationException {
		String str = "";
		Reader reader = null;
		Template t = null;
		StringWriter out = null;
		try {
			CompositeMap model = view_context.getModel();
			CompositeMap view = view_context.getView();
			IFreeMarkerTemplateProvider provider = (IFreeMarkerTemplateProvider) mObjectRegistry.getInstanceOfType(IFreeMarkerTemplateProvider.class);
			reader = new BufferedReader(new StringReader(view.getText()));
			t = new Template(view.getName(), reader, provider.getFreeMarkerConfiguration(), provider.getDefaultEncoding());
			out = new StringWriter();
			Map p = new HashMap();
			p.put("view", view);
			p.put("model", model);
			t.process(p, out);
			out.flush();
			str = out.toString();
			 
			StringBuffer sb = new StringBuffer();
			
			Map nsm = view.getRoot().getNamespaceMapping();
			if(nsm==null) nsm = new HashMap();
			String prefix = (String)nsm.get(AuroraApplication.AURORA_FRAMEWORK_NAMESPACE);
			if(prefix==null){
				prefix = view.getPrefix();
				nsm.put(AuroraApplication.AURORA_FRAMEWORK_NAMESPACE, prefix);
			}
			sb.append("<").append(prefix).append(":screen ");
			Set ks = nsm.keySet();
			Iterator it = ks.iterator();
			while(it.hasNext()){
				String key = (String)it.next();
				String value = (String)nsm.get(key);
				sb.append("xmlns:").append(value).append("=\"").append(key).append("\" ");
			}
			
			sb.append(">").append(str).append("</").append(view.getPrefix()).append(":screen>");
			CompositeLoader cl = new CompositeLoader();
			List list = new ArrayList();
			System.out.println(sb);
			CompositeMap c = cl.loadFromString(sb.toString(), provider.getDefaultEncoding());
			list.add(c);
			session.buildViews(model, list);
		} catch (Exception e) {
			throw new aurora.presentation.ViewCreationException(e.getMessage());
		} finally {
			if(reader != null) reader.close();
			if(out != null) out.close();
		}
	}

	public String[] getBuildSteps(ViewContext context) {
		return null;
	}
}
