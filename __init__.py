from pathlib import Path
import csv

class JFE_Table(list[dict[str, str]]):
    filename: str

    def __init__(self, filename: str) -> None:
        self.filename = filename
        with open(Path(__file__).parent.joinpath(self.filename), "r", encoding="utf_8_sig") as fp:
            super().__init__(csv.DictReader(fp))

    def keys(self) -> list[str]:
        return self[0].keys()

    def get_by_key(self, key: str) -> dict[str, str]:
        return self.get_by_value("key", key)[0]

    def get_by_value(self, key: str, value: str) -> list[dict[str, str]]:
        return [d for d in filter(lambda d: d[key] == value, self)]
