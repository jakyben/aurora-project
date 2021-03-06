package aurora.excel.model.files;

import java.util.ArrayList;
import java.util.List;

import uncertain.composite.CompositeMap;
import aurora.excel.model.DATLine;
import aurora.excel.model.format.Formater;
import aurora.excel.model.format.runner.XLSFileSetting;

public class XLSFile extends AbstractXLSFile {

	private static final String KEY = Formater.KEY;

	private XLSFileSetting setting;

	private List<String> key_word_codes = new ArrayList<String>();

	private int key_word_start;

	public XLSFile(XLSFileSetting setting, int key_word_start) {
		super();
		this.setting = setting;
		this.setFilePath(setting.getFilePath());
		this.key_word_start = key_word_start;
	}

	private String makeLine(String key_word_code, CompositeMap m) {
		List childsNotNull = m.getChildsNotNull();
		StringBuilder sb = new StringBuilder();
		for (Object object : childsNotNull) {
			CompositeMap mm = ((CompositeMap) object);
			String s = mm.getString("value", "");
			sb.append("|");
			sb.append(s);
		}
		return key_word_code + sb.toString();
	}

	public int makeKeyWordCode() {
		CompositeMap xls_setting = setting.getXls_setting();
		List childsNotNull = xls_setting.getChildsNotNull();
		// I00001
		int i = key_word_start;
		for (Object object : childsNotNull) {
			CompositeMap m = ((CompositeMap) object);
			if ("idx".equals(m.getName())) {
				String[] a_codes = Formater.getArea_codes(m);
				for (String a_code : a_codes) {
					if (i < 10) {
						key_word_codes.add(KEY + "0000" + i);
					} else if (i < 100) {
						key_word_codes.add(KEY + "000" + i);
					} else if (i < 1000) {
						key_word_codes.add(KEY + "00" + i);
					} else if (i < 10000) {
						key_word_codes.add(KEY + "0" + i);
					} else if (i < 100000) {
						key_word_codes.add(KEY + "" + i);
					}
					i++;
				}
			}
		}
		return i;

	}

	public IDX makeIDXFile() {
		IDX idx = new IDX();
		CompositeMap xls_setting = setting.getXls_setting();
		List childsNotNull = xls_setting.getChildsNotNull();
		int i = 0;
		for (Object object : childsNotNull) {
			CompositeMap m = ((CompositeMap) object);
			if ("idx".equals(m.getName())) {
				String[] a_codes = Formater.getArea_codes(m);
				for (String a_code : a_codes) {
					String key_word_code = key_word_codes.get(i);
					i++;
					idx.addHead(makeLine(key_word_code, m, a_code));
				}
			}
		}
		return idx;
	}

	private String makeLine(String key_word_code, CompositeMap m, String a_code) {

		List childsNotNull = m.getChildsNotNull();
		StringBuilder sb = new StringBuilder();
		for (Object object : childsNotNull) {
			CompositeMap mm = ((CompositeMap) object);
			String s = mm.getString("value", "");
			if ("area_code".equals(mm.getName())) {
				s = a_code;
			}
			sb.append("|");
			sb.append(s);
		}
		return key_word_code + sb.toString();
	}

	public DAT makeDATFile() {
		CompositeMap xls_setting = setting.getXls_setting();
		CompositeMap dat_setting = xls_setting.getChild("dat");
		// start_row", "数据开始行号", "6"));
		// dat.addChild(createMap("target_code", "指标代码列", "2"));
		// CompositeMap createMap = createMap("data", "数据值列", "3");
		String s1 = dat_setting.getChild("start_row").getString("value", "6");
		String s2 = dat_setting.getChild("target_code").getString("value", "2");
		int start = Integer.valueOf(s1);
		int target_code_c = Integer.valueOf(s2) - 1;

		List<XLSLine> datas = readXLS(start - 1);
		List childsNotNull = dat_setting.getChildsNotNull();

		DAT dat = new DAT();
		List<CompositeMap> datDataSettings = getDatDatasSetting();
		List idx_settings = xls_setting.getChildsNotNull();
		int k = 0;
		int idx = 0;
		for (Object object : idx_settings) {
			CompositeMap m = ((CompositeMap) object);
			if ("idx".equals(m.getName())) {
				String[] a_codes = Formater.getArea_codes(m);
				for (String a_code : a_codes) {
					String key_word_code = key_word_codes.get(k);
					k++;
					if (datDataSettings.size() > idx) {
						CompositeMap dm = datDataSettings.get(idx);
						String s3 = dm.getString("value", "3");
						int col = Integer.valueOf(s3);
						for (int i = 0; i < datas.size(); i++) {
							List<String> dds = datas.get(i).getDatas();
							String target_code = dds.get(target_code_c);
							String data = dds.get(col);
							if (target_code == null || data == null
									|| "".equals(target_code.trim())
									|| "".equals(data.trim())
									|| "0".equals(data.trim()))
								continue;
							dat.addHead(new DATLine(key_word_code, target_code,
									data).toDATString());
						}
					}
				}
				idx++;
			}
		}

		return dat;
	}

	private List<CompositeMap> getDatDatasSetting() {
		CompositeMap xls_setting = setting.getXls_setting();
		CompositeMap dat_setting = xls_setting.getChild("dat");
		List<CompositeMap> datDatas = new ArrayList<CompositeMap>();
		List childsNotNull = dat_setting.getChildsNotNull();
		for (Object object : childsNotNull) {
			CompositeMap m = ((CompositeMap) object);
			if ("data".equals(m.getName())) {
				datDatas.add(m);
			}
		}
		return datDatas;
	}

	public XLSFileSetting getSetting() {
		return setting;
	}

	public void setSetting(XLSFileSetting setting) {
		this.setting = setting;
	}
}
