from pathlib import Path
import csv

class JFE_Table(list[dict[str, str]]):
    """CSVファイルを読み込んで、それをkeyと任意のkeyとvalueの組合せから行を取得出来るようにする
    """
    filename: str

    def __init__(self, filename: str) -> None:
        """
        filename
            - 5. 断面性能表/5-1.1. H形鋼.csv
            - 5. 断面性能表/5-1.2. H形鋼_部材種別.csv
            - 5. 断面性能表/5-3. CT形鋼.csv
            - 5. 断面性能表/5-4. 溶接軽量H形鋼.csv
            - 5. 断面性能表/5-5.1. 等辺山形鋼.csv
            - 5. 断面性能表/5-5.2. 不等辺山形鋼.csv
            - 5. 断面性能表/5-5.3. 不等辺不等厚山形鋼.csv
            - 5. 断面性能表/5-5.4. 溝形鋼.csv
            - 5. 断面性能表/5-5.5. I形鋼.csv
            - 5. 断面性能表/5-6. 角型鋼管（小径）.csv
            - 5. 断面性能表/5-7.1. STKR400, STKR490.csv
            - 5. 断面性能表/5-7.2. BCR295, JBCR385.csv
            - 5. 断面性能表/5-8. 冷間成形角形鋼管.csv
            - 5. 断面性能表/5-9. カクホット.csv
            - 5. 断面性能表/5-10.1. UOE鋼管、板巻き鋼管.csv
            - 5. 断面性能表/5-10.2. 電縫鋼管.csv
            - 5. 断面性能表/5-10.3. シームレス鋼管.csv
            - 5. 断面性能表/5-11. 溶接四面ボックス.csv
            - 5. 断面性能表/5-12.1. 平鋼.csv
            - 5. 断面性能表/5-12.2. 鋼板の単位質量表.csv
            - 6. 高力ボルト接合部/6-1. 高力ボルトおよびボルトの許容耐力表.csv
            - 6. 高力ボルト接合部/6-6.1. H梁継手性能表_SN400-M20.csv
            - 6. 高力ボルト接合部/6-6.2. H梁継手性能表_SN400-M22.csv
            - 6. 高力ボルト接合部/6-6.3. H梁継手性能表_SN490-M20.csv
            - 6. 高力ボルト接合部/6-6.4. H梁継手性能表_SN490-M22.csv
            - 6. 高力ボルト接合部/6-6.5. H梁継手性能表_HBL-H355-M20.csv
            - 6. 高力ボルト接合部/6-6.6. H梁継手性能表_HBL-H355-M22.csv
            - 8. 各部構造/8-1.2. 異形棒鋼.csv
            - 8. 各部構造/8-8.1. 露出柱脚アンカーボルト.csv
        """
        self.filename = filename
        with open(Path(__file__).parent.joinpath(self.filename), "r", encoding="utf_8_sig") as fp:
            super().__init__(csv.DictReader(fp))

    def keys(self) -> list[str]:
        """表のヘッダ一覧を返す"""
        return self[0].keys()

    def get_by_key(self, key: str) -> dict[str, str]:
        """keyで一致する行を返す"""
        return self.get_by_value("key", key)[0]

    def get_by_value(self, key: str, value: str) -> list[dict[str, str]]:
        return [d for d in filter(lambda d: d[key] == value, self)]
