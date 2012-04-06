package aurora.ide.meta.gef.editors.source.gen.core;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;

import uncertain.composite.CompositeMap;
import aurora.ide.meta.exception.TemplateNotBindedException;
import aurora.ide.meta.gef.editors.models.AuroraComponent;
import aurora.ide.meta.gef.editors.models.Button;
import aurora.ide.meta.gef.editors.models.ButtonClicker;
import aurora.ide.meta.gef.editors.models.Container;
import aurora.ide.meta.gef.editors.models.Dataset;
import aurora.ide.meta.gef.editors.models.DatasetBinder;
import aurora.ide.meta.gef.editors.models.Grid;
import aurora.ide.meta.gef.editors.models.GridColumn;
import aurora.ide.meta.gef.editors.models.IDatasetFieldDelegate;
import aurora.ide.meta.gef.editors.models.Input;
import aurora.ide.meta.gef.editors.models.Renderer;
import aurora.ide.meta.gef.editors.models.TabFolder;
import aurora.ide.meta.gef.editors.models.TabItem;
import aurora.ide.meta.gef.editors.models.Toolbar;
import aurora.ide.meta.gef.editors.models.ViewDiagram;
import aurora.ide.meta.gef.editors.models.link.Parameter;
import aurora.ide.meta.gef.editors.models.link.TabRef;

public class ScreenGenerator {

	private IDGenerator idGenerator;
	private AuroraComponent2CompositMap a2Map;
	private ScriptGenerator scriptGenerator;

	private Map<Dataset, String> datasetMaper = new HashMap<Dataset, String>();

	private IProject project;
	private CompositeMap screenMap;
	private CompositeMap viewMap;
	private CompositeMap scriptMap;
	private CompositeMap datasetsMap;
	private CompositeMap screenBodyMap;
	private ViewDiagram viewDiagram;
	private DatasetGenerator datasetGenerator;

	public ScreenGenerator(IProject project) {
		this.project = project;
	}

	public String genFile(String header, ViewDiagram view)
			throws TemplateNotBindedException {
		String bindTemplate = view.getBindTemplate();
		boolean forCreate = view.isForCreate();

		if (bindTemplate == null || "".equals(bindTemplate))
			throw new TemplateNotBindedException();
		init(view);
		run(view);

		String xml = header + screenMap.toXML();
		return xml;
	}

	private void run(ViewDiagram viewDiagram) {

		genDatasets();

		fill(viewDiagram, screenBodyMap);
		fillLinks(viewMap);
		scriptMap.setText(scriptGenerator.getScript());
	}

	private void genDatasets() {
		List<Container> sectionContainers = viewDiagram
				.getSectionContainers(viewDiagram);
		for (Container container : sectionContainers) {
			datasetGenerator.fillDatasets(container);
		}
	}

	private void init(ViewDiagram view) {
		viewDiagram = view;
		idGenerator = new IDGenerator(view);
		a2Map = new AuroraComponent2CompositMap(this);
		screenMap = AuroraComponent2CompositMap.createScreenCompositeMap();
		viewMap = a2Map.toCompositMap(view);
		scriptMap = viewMap.createChild("script");
		datasetsMap = createCompositeMap("dataSets");
		screenBodyMap = createCompositeMap("screenBody");
		screenMap.addChild(viewMap);
		viewMap.addChild(datasetsMap);
		viewMap.addChild(screenBodyMap);
		scriptGenerator = new ScriptGenerator(this, scriptMap);
		datasetGenerator = new DatasetGenerator(this);
	}

	private void fill(Container container, CompositeMap containerMap) {
		List<AuroraComponent> children = container.getChildren();
		for (AuroraComponent ac : children) {
			CompositeMap childMap = a2Map.toCompositMap(ac);
			if (childMap == null) {
				continue;
			}

			if (ac instanceof GridColumn && container instanceof Grid) {
				CompositeMap columns = getColumns(containerMap);
				columns.addChild(childMap);
			} else if (ac instanceof TabItem && container instanceof TabFolder) {
				CompositeMap tabs = containerMap.getChild("tabs");
				if (tabs == null) {
					tabs = createCompositeMap("tabs");
					containerMap.addChild(tabs);
				}
				tabs.addChild(childMap);
			} else {
				containerMap.addChild(childMap);
			}
			if (ac instanceof TabItem) {
				genTabRef((TabItem) ac, childMap, container, containerMap);
				fill(((TabItem) ac).getBody(), childMap);
			}
			if (ac instanceof GridColumn) {
				genColumnEditor((GridColumn) ac, childMap, containerMap);
				genColumnRenderer((GridColumn) ac, childMap, containerMap);
			}
			if (ac instanceof Button) {
				fillButton((Button) ac, childMap);
			}
			if (ac instanceof Container) {
				fill((Container) ac, childMap);
				// fillDatasets((Container) ac);
			}
			if (ac instanceof DatasetBinder) {
				datasetGenerator.bindDatasetMap(container, ac, childMap);
			}
			Dataset dataset = datasetGenerator.findDataset(ac.getParent());
			if (ac instanceof IDatasetFieldDelegate) {
				datasetGenerator.fillDatasetMap(dataset, ac);
			}

			if (isLov(ac)) {
				a2Map.doLovMap(dataset, ac, childMap);
			}
		}
	}

	private void genTabRef(TabItem ac, CompositeMap childMap,
			Container container, CompositeMap containerMap) {

		TabRef tabRef = ac.getTabRef();
		if (tabRef != null) {
			String url = tabRef.getUrl();
			List<Parameter> parameters = tabRef.getParameters();
			getUrl(url, parameters);
		}
	}

	private void getUrl(String url, List<Parameter> parameters) {
		if (url == null)
			return;
		IPath path = new Path(url);
		path = path.removeFileExtension().addFileExtension("screen");
		for (int i = 0; i < parameters.size(); i++) {
			if (i == 0) {
				path = path.append("?");
			}
			path.append(parameters.get(i).toParameterFormat());

			if (i < parameters.size() - 1) {
				path = path.append("&");
			}
		}
	}

	private boolean isLov(AuroraComponent ac) {
		if (ac instanceof GridColumn) {
			return Input.LOV.equals(((GridColumn) ac).getEditor());
		}
		if (ac instanceof Input) {
			return Input.LOV.equals(ac.getType());
		}
		return false;
	}

	private void genColumnRenderer(GridColumn ac, CompositeMap childMap,
			CompositeMap containerMap) {
		Renderer renderer = ac.getRenderer();
		String functionName = this.scriptGenerator.genRenderer(renderer);
		if (null == functionName || "".equals(functionName))
			return;
		childMap.put(GridColumn.RENDERER, functionName);
	}

	private void fillLinks(CompositeMap view) {
		Map<Object, String> linkIDs = scriptGenerator.getLinkIDs();
		Set<Object> keySet = linkIDs.keySet();
		for (Object bc : keySet) {
			String openPath = "";
			if (bc instanceof Renderer) {
				openPath = ((Renderer) bc).getOpenPath();
			} else if (bc instanceof ButtonClicker) {
				openPath = ((ButtonClicker) bc).getOpenPath();
			} else {
				continue;
			}
			IPath requestPath = new Path("${/request/@context_path}");
			IPath path = requestPath.append(openPath);
			CompositeMap link = createCompositeMap("link");
			link.put("url", path.toString());
			link.put("id", linkIDs.get(bc));
			view.addChild(0, link);
		}
	}

	public CompositeMap createCompositeMap(String name) {
		return AuroraComponent2CompositMap.createChild(name);
	}

	public String genEditorID(String editorType) {
		return idGenerator.genEditorID(editorType);
	}

	public void fillButton(Button ac, CompositeMap buttonMap) {
		if (ac.getParent() instanceof Toolbar) {
			return;
		}
		ButtonClicker bc = ((Button) ac).getButtonClicker();
		String functionName = this.scriptGenerator.genButtonClicker(bc);
		if (null == functionName || "".equals(functionName))
			return;
		buttonMap.put("click", functionName);
	}

	private void genColumnEditor(GridColumn ac, CompositeMap colmunMap,
			CompositeMap containerMap) {
		CompositeMap gridMap = findGridMap(containerMap);
		if (gridMap == null)
			return;
		String editorType = ac.getEditor();
		if (editorType != null && !("".equals(editorType))) {
			CompositeMap editors = getEditors(gridMap);
			CompositeMap editorMap = editors.getChild(editorType);
			if (editorMap == null) {
				editorMap = createCompositeMap(editorType);
				String id = genEditorID(editorType);
				editorMap.put("id", id);
				editors.addChild(editorMap);
			}
			colmunMap.put(GridColumn.EDITOR, editorMap.get("id"));
		}
	}

	private CompositeMap findGridMap(CompositeMap containerMap) {
		if ("grid".equalsIgnoreCase(containerMap.getName())) {
			return containerMap;
		}
		if ("screenBody".equalsIgnoreCase(containerMap.getName())) {
			return null;
		}
		return findGridMap(containerMap.getParent());
	}

	public CompositeMap getEditors(CompositeMap gridMap) {
		CompositeMap editors = gridMap.getChild("editors");
		if (editors == null) {
			editors = createCompositeMap("editors");
			gridMap.addChild(editors);
		}
		return editors;
	}

	public CompositeMap getColumns(CompositeMap gridMap) {
		CompositeMap columns = gridMap.getChild("columns");
		if (columns == null) {
			columns = createCompositeMap("columns");
			gridMap.addChild(columns);
		}
		return columns;
	}

	public AuroraComponent2CompositMap getA2Map() {
		return a2Map;
	}

	public ScriptGenerator getScriptGenerator() {
		return scriptGenerator;
	}

	public Map<Dataset, String> getDatasetMaper() {
		return datasetMaper;
	}

	public CompositeMap getScreenMap() {
		return screenMap;
	}

	public CompositeMap getViewMap() {
		return viewMap;
	}

	public CompositeMap getScriptMap() {
		return scriptMap;
	}

	public CompositeMap getDatasetsMap() {
		return datasetsMap;
	}

	public CompositeMap getScreenBodyMap() {
		return screenBodyMap;
	}

	public IDGenerator getIdGenerator() {
		return idGenerator;
	}

	public IProject getProject() {
		return project;
	}

	public void setProject(IProject project) {
		this.project = project;
	}

	public ViewDiagram getViewDiagram() {
		return viewDiagram;
	}

	public CompositeMap fillDatasets(Container container) {
		return this.datasetGenerator.fillDatasets(container);
	}

	public String findDatasetId(Container container) {
		return datasetGenerator.findDatasetId(container);
	}

	public CompositeMap fillDatasetsMap(Dataset ds) {
		return datasetGenerator.fillDatasetsMap(ds);
	}

}