package uncertain.ide.eclipse.editor.bm;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.eclipse.jface.dialogs.IDialogPage;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.ISelectionChangedListener;
import org.eclipse.jface.viewers.SelectionChangedEvent;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Text;

import uncertain.composite.CompositeMap;
import uncertain.ide.eclipse.editor.widgets.CustomDialog;
import uncertain.ide.eclipse.editor.widgets.GridViewer;
import uncertain.ide.eclipse.editor.widgets.core.IGridViewer;
import uncertain.ide.util.LocaleMessage;

/**
 * The "New" wizard page allows setting the container for the new file as well
 * as the file name. The page will only accept file name without the extension
 * OR with the extension that matches the expected one (bm).
 */

public class BMTableWizardPage extends WizardPage {
	private Text containerText;
	private BmNewWizard wizard;
	private String tableName;
	/**
	 * Constructor for SampleNewWizardPage.
	 * 
	 * @param pageName
	 */
	private final String[] ColumnProperties = { "TABLE_NAME", "TABLE_CAT",
			"TABLE_SCHEM", "TABLE_TYPE", "REMARKS" };
	DatabaseMetaData dbMetaData;
	GridViewer filterCompoment;

	public BMTableWizardPage(ISelection selection, BmNewWizard bmWizard) {
		super("wizardPage");
		setTitle(LocaleMessage.getString("bussiness.model.editor.file"));
		setDescription(LocaleMessage.getString("bm.wizard.desc"));
		this.wizard = bmWizard;
	}

	/**
	 * @see IDialogPage#createControl(Composite)
	 */
	public void createControl(Composite parent) {
		CompositeMap input = null;

		try {
			Connection dbConnection = wizard.getConnection();
			dbMetaData = dbConnection.getMetaData();
			input = getInput(dbMetaData, "%");
		} catch (Exception e) {
			CustomDialog.showExceptionMessageBox(e);
		}
		// FilterCompositeMap filterCompositeMap = new FilterCompositeMap(input,
		// ColumnProperties, ColumnText, "TABLE_NAME", "TABLE_NAME");

		filterCompoment = new GridViewer(ColumnProperties,
				IGridViewer.filterBar|IGridViewer.NoToolBar);
		filterCompoment.setData(input);
		filterCompoment.setFilterColumn("TABLE_NAME");
		filterCompoment.setGridProperties(ColumnProperties);
		filterCompoment.createViewer(parent);
		filterCompoment
				.addSelectionChangedListener(new ISelectionChangedListener() {

					public void selectionChanged(SelectionChangedEvent event) {
						if(getTableName()==null)
							setPageComplete(false);
						else
							setPageComplete(true);
						wizard.refresh();
						

					}
				});
		setControl(filterCompoment.getControl());
		setPageComplete(false);

	}

	public String getContainerName() {
		return containerText.getText();
	}

	public DatabaseMetaData getDBMetaData() {
		return dbMetaData;
	}

	public CompositeMap getPrimaryKeys() throws SQLException {
		CompositeMap primaryKeyArray = new CompositeMap(BmNewWizard.bm_pre,
				BmNewWizard.bm_uri, "primary-key");
		String tableName = getTableName();
		if(tableName == null)
			return primaryKeyArray;
		ResultSet tableRet = dbMetaData.getPrimaryKeys(null, dbMetaData
				.getUserName(), tableName);
		while (tableRet.next()) {
			CompositeMap field = new CompositeMap(BmNewWizard.bm_pre,
					BmNewWizard.bm_uri, "pk-field");
			field.put("name", tableRet.getString("COLUMN_NAME").toLowerCase());
			primaryKeyArray.addChild(field);
		}
		return primaryKeyArray;
	}

	public String getTableName() {
		CompositeMap record = filterCompoment.getSelection();
		if(record == null){
			return null;
		}
		tableName = record.getString("TABLE_NAME");
		return tableName;
	}

	private CompositeMap getInput(DatabaseMetaData DBMetaData,
			String tableNamePattern) throws SQLException {
		CompositeMap input = new CompositeMap();
		ResultSet tableRet = DBMetaData.getTables(null, DBMetaData
				.getUserName(), tableNamePattern, new String[] { "TABLE","VIEW" });
		while (tableRet.next()) {
			int seq = 0;
			CompositeMap element = new CompositeMap();
			element.put(ColumnProperties[seq], tableRet
					.getString(ColumnProperties[seq++]));
			element.put(ColumnProperties[seq], tableRet
					.getString(ColumnProperties[seq++]));
			element.put(ColumnProperties[seq], tableRet
					.getString(ColumnProperties[seq++]));
			element.put(ColumnProperties[seq], tableRet
					.getString(ColumnProperties[seq++]));
			element.put(ColumnProperties[seq], tableRet
					.getString(ColumnProperties[seq++]));
			input.addChild(element);
		}
		return input;
	}
}