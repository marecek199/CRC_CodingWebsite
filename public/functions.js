

// # 1 / pro definovaný stupeň polynomu navrhnete generující polynom,
// # 2 / vytvoříte enkodér a dekodér CRC kódu s možností uživatelského zadání generujícího polynomu dle bodu 1, kódového slova(kódování) a přijatého slova(dekódování)

// # Pozn.: Pro konstrukci cyklických kódů délky n potřebujeme najít generující polynomy g(z).Jejich vlastností je, že dělí polynom(z ^ n−1).
// # Vašim prvním úkolem bude, dle instrukcí cvičícího, vytvořit program, který nalezne rozklad(z ^ n−1) na ireducibilní polynomy(z ^ n−1) = P1(z) * P2(z) *... Z nich zvolíte generující polynom pro CRC.


Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

crcData = {
    word: NaN,
    code: NaN,
    sent_message: [NaN],
    array_message: [],
    errors_arr: [],
    word_long: NaN,
    found_error: NaN,
    rec_mess: NaN,
    genPoly: [],
    idx_error: []
};

function init() {
    crcData.word = NaN;
    crcData.code = NaN;
    crcData.sent_message = [NaN];
    crcData.array_message = [];
    crcData.errors_arr = [];
    crcData.word_long = NaN;
    crcData.found_error = NaN;
    crcData.rec_mess = NaN;
    crcData.genPoly = [];
    crcData.idx_error = [];
}

function init_dec() {
    crcData.errors_arr = [];
    crcData.found_error = NaN;
    crcData.rec_mess = NaN;
    crcData.genPoly = [];
    crcData.idx_error = [];
    document.getElementById("messPoly").innerHTML = "";
    document.getElementById("messCor").innerHTML = "";
    document.getElementById("errorPos").innerHTML = "";
    document.getElementById("errorCor1").innerHTML = "";
    document.getElementById("errorCor2").innerHTML = "";
}

function polynDiv(words, codes) {
    let word, code;
    if (typeof (words) == typeof (1))
        word = genArr(words);
    else
        word = words.slice();

    if (typeof (code) == typeof (1))
        code = genArr(code);
    else
        code = codes.slice();


    let concl = null;
    let inter_concl = null;
    let dlzka;
    while (word.length >= code.length) {
        dlzka = word.length - code.length;

        if (concl === null)
            concl = new Array(dlzka + 1).fill(0);

        concl[concl.length - dlzka - 1]++;

        inter_concl = new Array(word.length).fill(0);

        let index;
        for (let i = 0; i < code.length; i++) {
            if (code[i] == 1) {
                index = inter_concl.length - (code.length - i + dlzka);
                inter_concl[index]++;
            }
        }

        for (let i = 0; i < word.length; i++)
            inter_concl[i] = Math.abs(inter_concl[i] - word[i]);

        let i = 0
        while (inter_concl.length > 0 && inter_concl[i] == 0)
            inter_concl.shift();

        word = inter_concl.slice();
    }
    remain = word.slice();
    return [concl, remain]
}

function genArr(code) {
    word = [];
    if (typeof (code) === typeof (1)) {
        while (code >= 1) {
            if (code % 2 == 0)
                word.push(0);
            else
                word.push(1);
            code = Math.floor(code / 10);
        }
        return word.reverse();
    }
    else
        console.log('Error in gen Polyn')
}


function encoder(word, n, k) {

    // polynom generator 
    polynomGenerator(n, k)

    crcData.word_long = word.slice();

    if (crcData.genPoly.length > 0) {
        // increasing the size of the code_word
        for (let i = 1; i < crcData.genPoly[0].length; i++)
            crcData.word_long.push(0);
        for (let idx = 0; idx < crcData.genPoly.length; idx++) {
            // polynom dividing
            let ans = polynDiv(crcData.word_long, crcData.genPoly[idx]);
            let conl = ans[0];
            let remain = ans[1];
            remain = remainCare(remain, crcData.genPoly[idx]);

            crcData.array_message.push(word.slice()); // ? slice?
            for (let i = 0; i < remain.length; i++)
                crcData.array_message[idx].push(remain[i]);

            // let mess = crcData.array_message[idx].join('');
            console.log("Vysledna sprava je ");
            console.log(" Sprava : " + crcData.array_message[idx].join('') + ", a kodovanie : " + crcData.genPoly[idx].join(''));
        }
    }
    else {
        alert('Neexistuje kodovanie v zadanom tvare n,k')
        // console.log('Neexistuje kodovanie v tvare n,k')
    }

}

function decoder(rec_mess) {
    let ans, concl, remain;


    ans = polynDiv(rec_mess, crcData.code);
    concl = ans[0];
    remain = ans[1];

    if (remain.length == 0)
        console.log("Spravne prijata sprava");
    else {
        console.log("Chyba v sprave");
        crcData.found_error = remain.slice();
        generErrors();
        let idx = []
        for (let i = 0; i < crcData.errors_arr.length; i++) {
            if (crcData.found_error.join('') == crcData.errors_arr[i].join(''))
                idx.push(i);
        }

        crcData.idx_error = idx.slice();
        if (idx.length == 1)
            console.log("Chyba je na " + String(idx) + " mieste");
        else
            console.log("Chyba je na " + String(idx.join(' ')) + " mieste");
    }
}


function remainCare(remain, code) {
    while (remain.length < code.length - 1)
        remain.insert(0, 0)
    return remain
}


function generErrors() {
    let mess, ans, concl, remain;
    for (let i = 0; i < crcData.word_long.length; i++) {
        // if (i==6)
        mess = new Array(crcData.word_long.length - i).fill(0);
        mess[0] = 1;
        ans = polynDiv(mess, crcData.code);
        conl = ans[0];
        remain = ans[1];
        crcData.errors_arr.push(remain);
    }
    crcData.errors_arr.reverse();
}

function polynomGenerator(n, k) {
    // let n = crcData.word.length + crcData.code.length - 1;  //# - 3
    // let k = crcData.word.length;

    let r = n - k + 1;

    // generating array of polynoms
    let n_idx = r - 1;
    let arr = new Array(n_idx).fill(null);
    generateAllBinaryStrings(n_idx, arr, 0);

    let idx_del = [];
    let new_poly, ans, concl, remain;
    for (let i = 0; i < crcData.genPoly.length; i++) {
        new_poly = new Array(n + 1).fill(0);
        new_poly[0] = 1;
        new_poly[new_poly.length - 1] = 1;
        ans = polynDiv(new_poly, crcData.genPoly[i]);
        concl = ans[0];
        remain = ans[1];
        if (remain.length > 0)
            idx_del.push(i);
    }
    idx_del.reverse()

    for (let i = 0; i < idx_del.length; i++) {
        crcData.genPoly.splice(idx_del[i], 1);
    }

}

function generateAllBinaryStrings(n, arr, i) {
    if (i == n) {
        let newPoly = [];
        newPoly.push(1);
        for (let i = 0; i < n; i++) {
            newPoly.push(arr[i]);
        }
        crcData.genPoly.push(newPoly);
        return
    }
    arr[i] = 0;
    generateAllBinaryStrings(n, arr, i + 1);
    arr[i] = 1
    generateAllBinaryStrings(n, arr, i + 1);
}


let message, n, k, nkcode;
document.getElementById('encode').addEventListener("click", function () {

    // delleting the old table
    document.getElementById("tableBody").innerHTML = "";
    init();

    message = (document.getElementById("messInput").value);
    if (binaryCheck(message) == 1)
        return
    crcData.word = genArr(parseInt(message));

    let nkCode = document.getElementById('nkInput').value;

    if (nkGenCheck(nkCode) == 1)
        return
    ncode = parseInt(document.getElementById('nkInput').value.split(',')[0]);
    kcode = parseInt(document.getElementById('nkInput').value.split(',')[1]);




    encoder(crcData.word, ncode, kcode);


    var table = document.getElementById("tableBody");
    var row, cell1, cell2;

    for (let i = 0; i < crcData.array_message.length; i++) {
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.innerHTML = String(crcData.array_message[i].join(''));
        cell2.innerHTML = String(crcData.genPoly[i].join(''));
        row.addEventListener("click", function () {
            document.getElementById('messOut').value = (this.cells[0].textContent);
            document.getElementById('nkOut').value = (this.cells[1].textContent);
        })
    }

});



document.getElementById('decode').addEventListener("click", function () {
    init_dec();

    crcData.rec_mess = (document.getElementById('messOut').value);
    if (binaryCheck(crcData.rec_mess) == 1)
        return
    crcData.rec_mess = genArr(parseInt(crcData.rec_mess));

    crcData.code = (document.getElementById('nkOut').value);
    if (binaryCheck(crcData.code) == 1)
        return
    crcData.code = genArr(parseInt(crcData.code));



    // message = (document.getElementById("messInput").value);
    // if (binaryCheck(message) == 1)
    //     return
    // crcData.word = parseInt(message);
    // crcData.word = genArr(crcData.word);

    decoder(crcData.rec_mess);
    if (crcData.idx_error.length > 0) {
        let rec_message = "";
        for (let i = 0; i < String(crcData.rec_mess).length; i++) {
            if (crcData.rec_mess[i] == 1)
                rec_message += 'x^' + String(crcData.rec_mess.length - i - 1) + "+ ";
        }
        document.getElementById("messPoly").innerHTML = '<h5>' + String(rec_message) + '</h5>';
        document.getElementById("messCor").innerHTML = '<h5> S chybou </h5>';

        let error_pos = "x^" + String(crcData.idx_error[crcData.idx_error.length - 1]);
        document.getElementById("errorPos").innerHTML = '<h5> Chybna cast : ' + String(error_pos) + '</h5>';

        let error_corr = crcData.rec_mess.slice();
        // let nwm_idx = error_corr.length - crcData.idx_error[crcData.idx_error.length - 1];
        if (error_corr[error_corr.length - crcData.idx_error[crcData.idx_error.length - 1] - 1] == 1)
            error_corr[error_corr.length - crcData.idx_error[crcData.idx_error.length - 1] - 1] = 0;
        else
            error_corr[error_corr.length - crcData.idx_error[crcData.idx_error.length - 1] - 1] = 1;

        document.getElementById("errorCor1").innerHTML = '<h5> Opravena sprava : ' + String(error_corr.join('')) + '</h5>';
        crcData.rec_mess = error_corr.slice();
        rec_message = "";
        for (let i = 0; i < String(crcData.rec_mess).length; i++) {
            if (crcData.rec_mess[i] == 1)
                rec_message += 'x^' + String(crcData.rec_mess.length - i - 1) + "+ ";
        }
        document.getElementById("errorCor2").innerHTML = '<h5> Opraveny polynom : ' + String(rec_message) + '</h5>';

    }
    else {

        rec_message = "";
        for (let i = 0; i < String(crcData.rec_mess).length; i++) {
            if (crcData.rec_mess[i] == 1)
                rec_message += 'x^' + String(crcData.rec_mess.length - i - 1) + "+ ";
        }
        document.getElementById("messPoly").innerHTML = '<h5>' + String(rec_message) + '</h5>';
        document.getElementById("messCor").innerHTML = '<h5> Bezchybne </h5>';

    }


});

function binaryCheck(bin_arr) {

    for (let i = 0; i < bin_arr.length; i++) {
        if (parseInt(bin_arr[i]) == 0 || parseInt(bin_arr[i]) == 1) {

        } else {
            alert('Chyba binarneho vstupu');
            return 1;
        }
    }
    return 0;
};


function nkGenCheck(nkCode) {
    // debugger

    if (nkCode.split(',').length != 2) {
        alert("Chyba 'n,k' vstupu");
        return 1;
    }
    for (let i = 0; i < nkCode.split(',').length; i++) {
        console.log(parseInt(nkCode.split(',')[i]))
        if (Number.isInteger(parseInt(nkCode.split(',')[i])) != 1) {
            alert("Chyba 'n,k' vstupu");
            return 1;
        }
        if (parseInt(nkCode.split(',')[0]) <= parseInt(nkCode.split(',')[1])) {
            alert("Chyba 'n,k' vstupu");
            return 1;
        }
    }
    return 0;
}