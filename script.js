const elem = (id) => document.getElementById(id);

const display_length=(string)=>Math.ceil([...string].map(
    char=>(char.match(/[ -~]/)==null?2:1)
).reduce(
    (a, b) => a + b,
    0,
));

const create_section = (filename) => {
    return new Promise((resolve, reject)=>{
        fetch(filename).then(response=>response.text()).then(text=>{
            const lines = text.replace("\ufeff", "").split("\n").filter(line => line.length > 0);
            const keys = lines[0].split(",");
            const contents = lines.slice(1, ).map(line => line.split(","));

            const thead = ()=>{
                const thead = document.createElement("thead");
                const tr = document.createElement("tr");
                keys.forEach((key, idx)=>{
                    const max_length = contents.map(val=> val[idx] === undefined ? 0 : display_length(val[idx])).reduce((a, b) => a > b ? a : b, display_length(key)+4);
                    const input = document.createElement("input");
                    input.id = `${filename}_${key}`
                    input.type = "search";
                    input.placeholder = key;
                    input.name = filename
                    input.list = `${filename}_${key}_list`;
                    const input_size =  max_length > 0 ? max_length : 1;
                    input.size = input_size;
                    const th = document.createElement("th");
                    th.innerHTML = `<input type="search" placeholder="${key}" name="${filename}" list="${filename}_${key}_list" size=${input_size} onchange="search('${filename}');">`
                    tr.append(th);
                });
                thead.append(tr);
                return thead;
            };

            const tbody = ()=>{
                const tbody = document.createElement("tbody");
                contents.forEach((line, idx) => {
                    const tr = document.createElement("tr");
                    tr.className = idx % 2 == 0 ? "even" : "odd";
                    line.forEach(val=>{
                        const td = document.createElement("td");
                        td.innerText = val;
                        tr.append(td);
                    });
                    tbody.append(tr);
                });
                return tbody;
            };

            const table = () => {
                const table = document.createElement("table");
                table.id = filename
                table.append(thead());
                table.append(tbody());
                return table;
            };

            const h3 = ()=>{
                const a = document.createElement("a");
                a.href = filename
                a.innerText = filename
                const h3 = document.createElement("h3");
                h3.append(a);
                return h3;
            };

            const datalists = ()=>{
                const datalists = document.createElement("div");
                keys.forEach((key, idx)=>{
                    const choices = new Set(contents.map(line => line[idx]));
                    const datalist = document.createElement("datalist");
                    datalist.id = `${filename}_${key}_list`;
                    choices.forEach(val=>{
                        const option = document.createElement("option");
                        option.value = val;
                        datalist.append(option);
                    });
                    datalists.append(datalist);
                });
                return datalists
            };

            const section = () => {
                const section = document.createElement("section");
                section.id = `${filename}_section`
                section.append(h3());
                section.append(table());
                section.append(datalists());
                return section
            };

            resolve(section());
        }).catch((filename)=>reject(filename));
    });
};

const link = (filename) => {
    const a = document.createElement("a");
    a.href = `#${filename}_section`;
    a.text = filename;
    const li = document.createElement("li");
    li.append(a);
    return li;
};

const search = (filename) => {
    const query = Array.from(document.getElementsByName(filename)).map(val=>val.value);
    Array.from(elem(filename).getElementsByTagName("tbody")[0].getElementsByTagName("tr")).forEach(tr=>{
        tr.style.display = (
            Array.from(tr.getElementsByTagName("td")).every((val, i)=>(query[i]==""||val.innerText.indexOf(query[i]) > -1))
            ?""
            :"none"
        );
    });
};

const download = () => {
    const blob    = new Blob([
        '<!doctype html>\n<html lang="ja">\n',
        document.getElementsByTagName('html')[0].innerHTML,
        '\n</html>',
    ]);
    const url     = window.URL || window.webkitURL;
    const blobURL = url.createObjectURL(blob);

    // <a> を新たに作成し、ダウンロード用の設定をいろいろ
    const a = document.createElement('a');
    // URI を元にダウンロード時のファイル名を決定
    a.download = 'index.html';
    a.href     = blobURL;
    a.click();
};

const main = () => {
    const filenames = [
        // '2. 荷重および応力の組合せ/2-3. 積載荷重.csv',
        '5. 断面性能表/5-1.1. H形鋼.csv',
        '5. 断面性能表/5-1.2. H形鋼_部材種別.csv',
        '5. 断面性能表/5-10.1. UOE鋼管、板巻き鋼管.csv',
        '5. 断面性能表/5-10.2. 電縫鋼管.csv',
        '5. 断面性能表/5-10.3. シームレス鋼管.csv',
        '5. 断面性能表/5-11. 溶接四面ボックス.csv',
        '5. 断面性能表/5-12.1. 平鋼.csv',
        '5. 断面性能表/5-12.2. 鋼板の単位質量表.csv',
        '5. 断面性能表/5-3. CT形鋼.csv',
        '5. 断面性能表/5-4. 溶接軽量H形鋼.csv',
        '5. 断面性能表/5-5.1. 等辺山形鋼.csv',
        '5. 断面性能表/5-5.2. 不等辺等厚山形鋼.csv',
        '5. 断面性能表/5-5.3. 不等辺不等厚山形鋼.csv',
        '5. 断面性能表/5-5.4. 溝形鋼.csv',
        '5. 断面性能表/5-5.5. I形鋼.csv',
        '5. 断面性能表/5-6. 角型鋼管（小径）.csv',
        '5. 断面性能表/5-7.1. STKR400, STKR490.csv',
        '5. 断面性能表/5-7.2. BCR295, JBCR385.csv',
        '5. 断面性能表/5-8. 冷間成形角形鋼管.csv',
        '5. 断面性能表/5-9. カクホット.csv',
        '6. 高力ボルト接合部/6-1. 高力ボルトおよびボルトの許容耐力表.csv',
        '6. 高力ボルト接合部/6-6.1. H梁継手性能表_SN400-M20.csv',
        '6. 高力ボルト接合部/6-6.2. H梁継手性能表_SN400-M22.csv',
        '6. 高力ボルト接合部/6-6.3. H梁継手性能表_SN490-M20.csv',
        '6. 高力ボルト接合部/6-6.4. H梁継手性能表_SN490-M22.csv',
        '6. 高力ボルト接合部/6-6.5. H梁継手性能表_HBL-H355-M20.csv',
        '6. 高力ボルト接合部/6-6.6. H梁継手性能表_HBL-H355-M22.csv',
        '6. 高力ボルト接合部/6-8.1. 丸鋼接合表（ＪＩＳターンバックル筋かい）.csv',
        '6. 高力ボルト接合部/6-8.2. 筋かい接合表.csv',
        '8. 各部構造/8-1.2. 異形棒鋼.csv'
    ];
    Promise.all(
        filenames.map(filename => create_section(filename))
    ).then(
        sections => sections.forEach(
            section => elem("main").append(section)
        )
    ).catch(
        filename => console.log(filename)
    );
    filenames.forEach(filename=>elem("toc").append(link(filename)));
};

if(document.getElementsByTagName("li").length == 0){
    main();
}