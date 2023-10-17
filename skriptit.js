/*
function napinPainallus() {
    document.querySelector('#but1').click();
}

document.querySelector('#acc1text').addEventListener('hide.bs.collapse',(eve) => {
    console.log(eve.target.id);
});

function toinenNappula() {
    
    document.querySelector('#c1btn').click();
}
*/
let pelaajienlkm = noppienlkm = pisteraja = 0;
class pelaaja {
    constructor() {
        this.ndx = 0;
        this.nimi = '';
        this.pistemaara = 0;
        this.tuplalkm = 0;
    }
}
const pelaajalista = [];

function tarkistaArvo(src,cond,chng) {
    let check = src.value + cond;
    if (check == cond) { check = '0' + cond }
    if (!eval(check)) {
        src.classList.add('is-invalid');
        document.querySelector('#aloitabtn').classList.add('disabled');
    } else {
        if (src.classList.contains('is-invalid')) {
            src.classList.remove('is-invalid');
        }
        if (chng != '') {
            document.querySelector(chng).innerHTML = src.value;
        }
        let ck = 0;
        document.querySelectorAll('.tarkistettava').forEach(ele => {
            if (ele.classList.contains('is-invalid')) { ck += 1 }
        });
        if (ck == 0) {
            document.querySelector('#aloitabtn').classList.remove('disabled');
        } else {
            document.querySelector('#aloitabtn').classList.add('disabled');
        }
    }
}

function paivitaSaannot(nlkm) {
    if (nlkm == 1) {
        document.querySelector('#noppasana').innerHTML = 'nopan';
        document.querySelector('#muuttuvateksti').innerHTML = 'Pelaajat heittävät noppaa vuorotellen. Jos pelaaja heittää numeron 2-6 se lisätään kierroksen pistemäärään. Mikäli pelaaja heittää numeron 1, kierroksen pistemäärä nollataan ja vuoro siirtyy seuraavalle.';
    } else {
        document.querySelector('#noppasana').innerHTML = 'noppien';
        document.querySelector('#muuttuvateksti').innerHTML = 'Pelaajat heittävät kahta noppaa vuorotellen. Jos pelaaja heittää nopilla eri luvut ja toinen luvuista ei ole 1, lisätään lukujen summa kierroksen pistemäärään.<br><br>Jos pelaaja heittää nopilla samat luvut välillä 2-6, saa hän pistemäärän kaksinkertaisena. Mikäli pelaaja heittää molemmilla nopilla numeron 1, saa hän 25 pistettä.<br><br>Jos pelaaja heittää numeron 1 vain toisella nopalla tai jos hän heittää samat luvut kolme kertaa peräkkäin, kierroksen pisteet nollataan ja vuoro siirtyy seuraavalle.';
    }
}

function lisaaPelaaja(nro) {
    /* kloonataan template */
    const sijoituspaikka = document.querySelector('#pelaajalista');
    const kortti = document.querySelector('#korttitemplate');
    const klooni = kortti.content.cloneNode(true);

    klooni.querySelector('#pelaajanimi').innerHTML = 'Pelaaja #'+nro;
    klooni.querySelector('#pelaajanimi').id = 'pelaaja'+nro+'-nimi';
    klooni.querySelector('#pelaajapisteet-badge').id = 'pelaaja'+nro+'-pistebadge';
    klooni.querySelector('.card-header').setAttribute('data-bs-target','#pelaaja'+nro+'-collapsetarget');
    klooni.querySelector('#collapsetarget').id = 'pelaaja'+nro+'-collapsetarget';
    klooni.querySelector('#pelaajanimikentta').id = 'pelaaja'+nro+'-nimikentta';
    klooni.querySelector('#pelaajanimikenttabutton').id = 'pelaaja'+nro+'-nimikenttabutton';
    klooni.querySelector('#pelaajayhtpisteet').id = 'pelaaja'+nro+'-yhtpisteet';
    klooni.querySelector('#pelaajakierpisteet').id = 'pelaaja'+nro+'-kierpisteet';
    klooni.querySelector('#pelaajakortti').id = 'pelaaja'+nro+'-kortti';
    klooni.querySelector('#pelaajacollapsebutton').id = 'pelaaja'+nro+'-collapsebutton';

    sijoituspaikka.appendChild(klooni);

    let pel = new pelaaja();
    pel.ndx = nro;
    pelaajalista.push(pel);

    /* lisätäänkö viimeistä? Jos lisätään, niin näytetään ensimmäisen pelaajan kortti */
    if (nro == pelaajienlkm) {
        document.querySelector('#pelaaja1-collapsetarget').classList.add('show');
        document.querySelector('#pelaaja1-kortti').classList.add('border-primary');
        document.querySelector('#pelaaja1-nimikenttabutton').classList.remove('disabled');
        document.querySelector('#pelaaja1-nimikentta').focus();
    }
    
}

/* tarkistetaan painetaanko nimikentässä enteriä --> jos painetaan, "klikataan" nappulaa */
function tarkistaEnter(eve) {
    if (eve.key == 'Enter' || eve.keyCode == 13) {
        eve.preventDefault();
        document.querySelector('#'+eve.target.id+'button').click();
    }
}

function nimiButtonPress(src) {
    /* onko nimikentä nappula sallittuna? */
    let lahde = src.id;
    let alku = lahde.slice(0,lahde.indexOf('-'));

    if (!document.querySelector('#'+alku+'-nimikenttabutton').classList.contains('disabled')) {
        let numero = alku.replace('pelaaja','');
        let arvo = document.querySelector('#'+alku+'-nimikentta').value;

        /* tarkasta ensin onko arvo tyhjä! */
        if (arvo != '') {
            document.querySelector('#'+alku+'-nimi').innerText = arvo;
        } else {
            arvo = document.querySelector('#'+alku+'-nimikentta').value = document.querySelector('#'+alku+'-nimi').innerText = 'Pelaaja #'+numero;
        }

        pelaajalista[Number(numero)-1].nimi = arvo;

        /* onko viimeinen pelaaja? */
        if (!seuraavaNimi(numero)) {
            /* oli viimeinen pelaaja, odotetaan collapse loppuun ja aloitetaan peli */
            document.querySelector('#pelaaja'+numero+'-collapsebutton').addEventListener('hidden.bs.collapse', odotaCollapse(numero));
        }
    }

}

function odotaCollapse(numero) {
    document.querySelector('#pelaaja'+numero+'-collapsebutton').removeEventListener('hidden.bs.collapse', odotaCollapse)
    pelikierroksenAloitus();
}

function pelikierroksenAloitus() {
    document.querySelectorAll('.nimenkysely').forEach(ele  => {
        ele.classList.add('piilossa');
    });
    document.querySelectorAll('.pelikierros').forEach(ele  => {
        ele.classList.remove('piilossa');
    });

    document.querySelector('#pelaaja1-collapsebutton').click();
    document.querySelector('#pelaaja1-kortti').classList.add('border-primary');
}

function seuraavaNimi(nykyinen) {
    let onViimeinen = (nykyinen == pelaajienlkm) ? true : false;
    let seuraava = Number(nykyinen) + 1;

    document.querySelector('#pelaaja'+nykyinen+'-collapsebutton').click();
    document.querySelector('#pelaaja'+nykyinen+'-kortti').classList.remove('border-primary');

    if (!onViimeinen) {
        if (!document.querySelector('#pelaaja'+seuraava+'-collapsetarget').classList.contains('show')) {
            document.querySelector('#pelaaja'+seuraava+'-collapsebutton').click();
        }
        document.querySelector('#pelaaja'+seuraava+'-kortti').classList.add('border-primary');
        document.querySelector('#pelaaja'+seuraava+'-nimikenttabutton').classList.remove('disabled');
        document.querySelector('#pelaaja'+seuraava+'-nimikentta').focus();
    }

    return !onViimeinen; /* palautetaan true jos ei ollut viimeinen, false jos oli */
}

function aloita() {
    
    const aloitusDiv = document.querySelector('#aloitus');
    /* aloitusDiv.style.height = getComputedStyle(aloitusDiv).height; */
    document.querySelector(':root').style.setProperty('--korkeus',getComputedStyle(aloitusDiv).height);


    pelaajienlkm = Number(document.querySelector('#pellkm').value);
    noppienlkm = Number(document.querySelector('#noplkm').value);
    pisteraja = Number(document.querySelector('#voittavapstm').value);
    
    aloitusDiv.classList.add('haipyy');

    for (let i = 0;i<pelaajienlkm;i++) {
        lisaaPelaaja(i+1);
    }

    if (noppienlkm == 1) {
        document.querySelector('#noppa2-alue').classList.add('piilossa');
    } else {
        document.querySelector('#noppa2-alue').classList.remove('piilossa');
    }

}

const noppakaannot = [
    'rotate3d(0,0,0,0deg)',
    'rotate3d(0,1,0,-450deg)',
    'rotate3d(1,0,0,450deg)',
    'rotate3d(1,0,0,-810deg)',
    'rotate3d(0,1,0,810deg)',
    'rotate3d(0,-1,0,540deg)'
]

function paivitanoppa(numero,nopannro) {
    if (numero > 0 && numero < 7) {
        const noppa = document.querySelector('#noppa'+nopannro);
        noppa.style.transform = noppakaannot[numero-1];
    }
}

document.addEventListener('keypress', (eve) => {
    switch(eve.key) {
        case '1':
            paivitanoppa(1,1);
            break;
        case '2':
            paivitanoppa(2,1);
            break;
        case '3':
            paivitanoppa(3,1);
            break;
        case '4':
            paivitanoppa(4,1);
            break;
        case '5':
            paivitanoppa(5,1);
            break;
        case '6':
            paivitanoppa(6,1);
            break;
    }
});


document.querySelector('#pellkm').focus();
