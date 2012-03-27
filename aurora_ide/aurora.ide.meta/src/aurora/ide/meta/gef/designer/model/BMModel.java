package aurora.ide.meta.gef.designer.model;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.ArrayList;
import java.util.List;

public class BMModel {
	public static final String TITLE = "title";
	public static final int RECORD = 0;
	public static final int RELATION = 1;
	private ArrayList<Record> records = new ArrayList<Record>();
	private ArrayList<Relation> relations = new ArrayList<Relation>();
	PropertyChangeSupport listeners = new PropertyChangeSupport(this);
	private String title = "";
	public static final String FIELD_NAME_PREFIX = "c";
	private PropertyChangeListener recordListener = new PropertyChangeListener() {

		public void propertyChange(PropertyChangeEvent evt) {
			Record r = (Record) evt.getSource();
			firePropertyChange(Record.class.getSimpleName() + ":" + r.getNum()
					+ ":" + evt.getPropertyName(), evt.getOldValue(),
					evt.getNewValue());
		}

	};

	private PropertyChangeListener relationListener = new PropertyChangeListener() {

		public void propertyChange(PropertyChangeEvent evt) {
			Record r = (Record) evt.getSource();
			firePropertyChange(
					Relation.class.getSimpleName() + ":" + r.getNum() + ":"
							+ evt.getPropertyName(), evt.getOldValue(),
					evt.getNewValue());
		}

	};

	public ArrayList<Record> getRecordList() {
		return records;
	}

	public ArrayList<Relation> getRelationList() {
		return relations;
	}

	public Record[] getRecords() {
		Record[] rcds = new Record[records.size()];
		records.toArray(rcds);
		return rcds;
	}

	public Relation[] getRelations() {
		Relation[] rels = new Relation[relations.size()];
		relations.toArray(rels);
		return rels;
	}

	public int add(Record record) {
		records.add(record);
		notifyModidy();
		return records.size() - 1;
	}

	public int add(Relation rel) {
		relations.add(rel);
		nodifyRelationChange();
		return relations.size() - 1;
	}

	public void add(int idx, Record r) {
		records.add(idx, r);
		notifyModidy();
	}

	public void add(int idx, Relation rel) {
		relations.add(idx, rel);
		nodifyRelationChange();
	}

	public void remove(Record r) {
		records.remove(r);
		notifyModidy();
	}

	public void remove(Relation rel) {
		relations.remove(rel);
		nodifyRelationChange();
	}

	public Record removeRecord(int idx) {
		Record r = records.remove(idx);
		notifyModidy();
		return r;
	}

	public Relation removeRelation(int idx) {
		Relation rel = relations.remove(idx);
		nodifyRelationChange();
		return rel;
	}

	private void notifyModidy() {
		ArrayList<Record> unNamedRelation = new ArrayList<Record>();
		int maxNum = 0;
		for (int i = 0; i < records.size(); i++) {
			Record r = records.get(i);
			r.setNum(i + 1);
			r.removePropertyChangeListener(recordListener);
			r.addPropertyChangeListener(recordListener);
			if (r.getName().trim().length() == 0)
				unNamedRelation.add(r);
			if (r.getName().matches(FIELD_NAME_PREFIX + "(0|([1-9]\\d*))")) {
				int n = Integer.parseInt(r.getName().substring(1));
				if (maxNum < n)
					maxNum = n;
			}
		}
		for (Record r : unNamedRelation) {
			r.setName(FIELD_NAME_PREFIX + (++maxNum));
		}
		firePropertyChange("reorder", null, null);
	}

	private void nodifyRelationChange() {

		for (int i = 0; i < relations.size(); i++) {
			Relation r = relations.get(i);
			r.setNum(i + 1);
			r.removePropertyChangeListener(relationListener);
			r.addPropertyChangeListener(relationListener);

		}

		firePropertyChange("relation", null, null);
	}

	public boolean isEmpty() {
		return records.isEmpty();
	}

	public boolean isFirst(Record r) {
		if (isEmpty())
			return false;
		return records.get(0).equals(r);
	}

	public boolean isLast(Record r) {
		if (isEmpty())
			return false;
		return records.get(records.size() - 1).equals(r);
	}

	public int indexOf(Record r) {
		return records.indexOf(r);
	}

	public Record getAt(int idx) {
		return records.get(idx);
	}

	public void setAt(int idx, Record r) {
		records.set(idx, r);
		notifyModidy();
	}

	public void remove(List<Record> list) {
		records.removeAll(list);
		notifyModidy();
	}

	public void removeRelations(List<Relation> list) {
		relations.removeAll(list);
		nodifyRelationChange();
	}

	public void removeAll() {
		records.clear();
		notifyModidy();
	}

	public void addPropertyChangeListener(PropertyChangeListener l) {
		listeners.addPropertyChangeListener(l);
	}

	public void removePropertyChangeListener(PropertyChangeListener l) {
		listeners.removePropertyChangeListener(l);
	}

	protected void firePropertyChange(String prop, Object old, Object newValue) {
		listeners.firePropertyChange(prop, old, newValue);
	}

	protected void fireStructureChange(String prop, Object child) {
		listeners.firePropertyChange(prop, null, child);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		if (title == null)
			title = "";
		if (this.title.equals(title))
			return;
		String old = this.title;
		this.title = title;
		firePropertyChange(TITLE, old, title);
	}
}