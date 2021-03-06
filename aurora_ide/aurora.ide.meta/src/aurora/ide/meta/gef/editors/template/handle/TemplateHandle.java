package aurora.ide.meta.gef.editors.template.handle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.core.resources.IFile;

import uncertain.composite.CompositeMap;
import aurora.ide.meta.gef.designer.BMCompositeMap;
import aurora.ide.meta.gef.editors.template.BMReference;
import aurora.ide.search.core.Util;
import aurora.plugin.source.gen.screen.model.AuroraComponent;
import aurora.plugin.source.gen.screen.model.BOX;
import aurora.plugin.source.gen.screen.model.Container;
import aurora.plugin.source.gen.screen.model.Dataset;
import aurora.plugin.source.gen.screen.model.Grid;
import aurora.plugin.source.gen.screen.model.GridColumn;
import aurora.plugin.source.gen.screen.model.Input;
import aurora.plugin.source.gen.screen.model.Renderer;
import aurora.plugin.source.gen.screen.model.ScreenBody;
import aurora.plugin.source.gen.screen.model.TabItem;

public abstract class TemplateHandle {
	protected ScreenBody viewDiagram;
	protected TemplateConfig config;
	public static final String GRID = "grid";

	// public static final String REF_TAB_ITEMS = "refTabItems";

	// public

	public TemplateHandle(TemplateConfig config) {
		this.config=config;
		//config = TemplateHelper.getInstance().getConfig();
		config.put(GRID, new ArrayList<Grid>());
		// config.put(REF_TAB_ITEMS, new ArrayList<TabItem>());
	}

	public void fill(ScreenBody viewDiagram) {
//		InitProcedure ip = viewDiagram.getInitProcedure();
//		if (ip != null)
//			ip.getModelQuerys().clear();
		setColNum(viewDiagram, 1); 
		this.viewDiagram = viewDiagram;
		for (BMReference bm : config.getModelRelated().keySet()) {
			for (Container ac : config.getModelRelated().get(bm)) {
				BMCompositeMap bmc = new BMCompositeMap(bm.getModel());
				fillContainer(ac, bm, bmc);
			}
		}

		for (BMReference bm : config.getQueryModelRelated().keySet()) {
			AuroraComponent ac = config.getAuroraComponents().get(config.getQueryModelRelated().get(bm));
			if (ac instanceof Container) {
				fillQueryBox((Container) ac, bm);
			}
		}

		for (BMReference bm : config.getInitModelRelated().keySet()) {
			for (TabItem ac : config.getInitModelRelated().get(bm)) {
				// config.get(REF_TAB_ITEMS).add(ac);
				if (bm.getModel() == null) {
					continue;
				}
				fillTabItem(ac, bm);
			}
		}
	}

	protected void fillBox(Container ac, BMCompositeMap bmc) {
		ac.getChildren().clear();
		for (CompositeMap map : getFieldsWithoutPK(bmc)) {
			Input input = AuroraModelFactory.createComponent(aurora.ide.meta.gef.Util.getType(map));
			input.setName(map.getString("name"));
			String prompt = map.getString("prompt");
			prompt = prompt == null ? "prompt" : prompt;
			input.setPrompt(prompt);
			((Container) ac).addChild(input);
		}
	}

	protected String getBmPath(IFile bm) {
		if (bm == null) {
			return "";
		}
		String s = Util.toPKG(bm.getFullPath());
		if (s.endsWith(".bm")) {
			s = s.substring(0, s.lastIndexOf(".bm"));
		}
		return s;
	}

	protected void fillContainer(Container ac, BMReference bm, BMCompositeMap bmc) {
		Dataset ds = ac.getDataset();
		String s = getBmPath(bm.getModel());
		ds.setModel(s);
		ac.setDataset(ds);
		ac.setSectionType(Container.SECTION_TYPE_RESULT);
		if (ac instanceof Grid) {
			fillGrid((Grid) ac, bmc);
		} else {
			fillBox(ac, bmc);
		}
	}

	protected void fillGrid(Grid grid, BMCompositeMap bmc) {
		for (int i = 0; i < grid.getChildren().size(); i++) {
			if (grid.getChildren().get(i) instanceof GridColumn) {
				grid.getChildren().remove(i);
				i--;
			}
		}
//		grid.getCols().clear();
		for (CompositeMap map : getFieldsWithoutPK(bmc)) {
			GridColumn gc = createGridColumn(map);
			grid.addCol(gc);
		}
		grid.setNavbarType(Grid.NAVBAR_COMPLEX);
		grid.setSelectionMode(Dataset.SELECT_MULTI);
		config.get(GRID).add(grid);
	}

	protected GridColumn createGridColumn(CompositeMap map) {
		GridColumn gc = new GridColumn();
		gc.setName(map.getString("name"));
		String prompt = map.getString("prompt");
		prompt = prompt == null ? map.getString("name") : prompt;
		gc.setPrompt(prompt);
		if (isDateType(map)) {
			Renderer r = new Renderer();
			r.setFunctionName("Aurora.formatDate");
			r.setRendererType(Renderer.INNER_FUNCTION);
			gc.setRenderer(r);
		}
		return gc;
	}

	protected boolean isDateType(CompositeMap map) {
		if ("TIMESTAMP".equalsIgnoreCase(BMCompositeMap.getMapAttribute(map, "databaseType"))) {
			return true;
		}
		if ("DATE".equalsIgnoreCase(BMCompositeMap.getMapAttribute(map, "databaseType"))) {
			return true;
		}
		if ("java.util.Date".equalsIgnoreCase(BMCompositeMap.getMapAttribute(map, "dataType"))) {
			return true;
		}
		if ("java.sql.Date".equalsIgnoreCase(BMCompositeMap.getMapAttribute(map, "dataType"))) {
			return true;
		}
		return false;
	}

	protected void fillQueryBox(Container ac, BMReference bm) {
		if (ac.getSectionType() == null || "".equals(ac.getSectionType())) {
			ac.setSectionType(Container.SECTION_TYPE_QUERY);
			String s = getBmPath(bm.getModel());
			Dataset ds = new Dataset();
			ds.setComponentType(Dataset.QUERYDATASET);
			ds.setModel(s);
			ac.setDataset(ds);
		} else if (Container.SECTION_TYPE_RESULT.equals(ac.getSectionType())) {
			if (ac instanceof Grid) {
				((Grid) ac).setSelectionMode(Dataset.SELECT_SINGLE);
			}
			return;
		}
		ac.getChildren().clear();
		BMCompositeMap bmc = new BMCompositeMap(bm.getModel());
		for (CompositeMap queryMap : getQueryFields(bmc)) {
			Input input = AuroraModelFactory.createComponent(aurora.ide.meta.gef.Util.getType(queryMap));
			input.setName(queryMap.getString("name"));
			input.setPrompt(aurora.ide.meta.gef.Util.getPrompt(queryMap,""));
			ac.addChild(input);
		}
	}

	protected void fillTabItem(TabItem ac, BMReference bm) {
		String s = getBmPath(bm.getModel());
//		ModelQuery m = new ModelQuery();
//		m.setPath(s);
//		ac.getTabRef().setModelQuery(m);
//		viewDiagram.addModelQuery(m);
	}

	protected Map<String, List<String>> getReferenceRelation(BMCompositeMap bmc) {
		Map<String, List<String>> refRelat = new HashMap<String, List<String>>();
		for (CompositeMap relation : bmc.getRelations()) {
			for (Object reference : relation.getChildsNotNull()) {
				String localfield = (BMCompositeMap.getMapAttribute((CompositeMap) reference, "localfield"));
				String relationName = relation.getString("name");
				if (localfield != null && relationName != null) {
					if (refRelat.get(relationName) == null) {
						refRelat.put(relationName, new ArrayList<String>());
					}
					refRelat.get(relationName).add(localfield);
				}
			}
		}
		return refRelat;
	}

	protected List<CompositeMap> getQueryFields(BMCompositeMap bmc) {
		List<CompositeMap> qfs = bmc.getQueryFields();
		List<CompositeMap> fields = getFieldsWithoutPK(bmc);
		List<CompositeMap> queryFields = new ArrayList<CompositeMap>();
		for (CompositeMap qf : qfs) {
			String name = qf.getString("name");
			if (name != null && name.length() > 0) {
				queryFields.add(qf);
				continue;
			}
			for (CompositeMap field : fields) {
				if (field.getString("name").equals(qf.getString("field"))) {
					queryFields.add(field);
				}
			}
		}
		return queryFields;
	}

	protected List<CompositeMap> getFieldsWithoutPK(BMCompositeMap bmc) {
		List<CompositeMap> pks = bmc.getPrimaryKeys();
		List<CompositeMap> fields = bmc.getFields();
		List<CompositeMap> fieldsWithoutPK = new ArrayList<CompositeMap>();
		for (CompositeMap pk : pks) {
			for (CompositeMap field : fields) {
				if (field.getString("name").equals(pk.getString("name"))) {
					continue;
				}
				fieldsWithoutPK.add(field);
			}
		}
		return fieldsWithoutPK;
	}

	protected void setColNum(ScreenBody viewDiagram, int col) {
		List<BOX> rowCols = new ArrayList<BOX>();
		boolean hasContainer = false;
		for (AuroraComponent ac : viewDiagram.getChildren()) {
			if (ac instanceof BOX) {
				if (((BOX) ac).getChildren().size() == 0) {
					rowCols.add((BOX) ac);
				}
			} else {
				hasContainer = true;
			}
		}
		if (!hasContainer) {
			for (BOX rc : rowCols) {
				rc.setCol(col);
			}
		}
	}

	public TemplateConfig getConfig() {
		return config;
	}
}
