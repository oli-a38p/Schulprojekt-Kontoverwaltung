// Sprache automatisch einstellen
DevExpress.localization.locale(navigator.language);

// Verwaltungs-Objekt der Konten
let accManager = new AccountManager();

let AccountDeletionProc = function () {
    // AM-TODO
};

const aTabs = [
    {
        id: 0,
        text: 'Neues Konto anlegen',
        icon: 'user',
        content: 
            '<form id="account-creation-form-container">' +
                '<div id="account-creation-form"></div>' + 
            '</form>' +
            '<div id="result">' +
                '<p id="result-text"></p>' +
            '</div>',
        func: AccountCreationProc
    }, {
        id: 1,
        text: 'Kontoauszug',
        icon: 'doc',
        content: 
            '<form id="account-statement-form-container">' +
                '<div id="account-statement-form"></div>' +
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<h3>Kontoauszug</h3>' +
                '<p>Kontonr.: <span class="text-bold" id="result-accountID"></span></p>' +
                '<p>Kontotyp: <span class="text-bold" id="result-accountType"></span></p>' +
                '<p>Konto angelegt: <span class="text-bold" id="result-accountCreationDate"></span></p>' +
                '<p>Kontoname: <span class="text-bold" id="result-accountName"></span></p>' +
                '<p>Kontoinhaber: <span class="text-bold" id="result-accountOwner"></span></p>' +
                '<p>Guthaben: <span class="text-bold" id="result-accountBalance"></span></p>' +
            '</div>',
        func: AccountStatementProc
    }, {
        id: 2,
        text: 'Einzahlung',
        icon: 'add',
        content:
            '<form id="account-deposit-form-container">' +
                '<div id="account-deposit-form"></div>' +
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<h3>Einzahlung</h3>' +
                '<p class="success-text">Vom dem Konto <span class="text-bold" id="result-accountOwner"></span> wurden <span class="text-bold" id="result-value"></span> EUR ausgezahlt.</p>' +
            '</div>',
        func: AccountDepositProc
    }, {
        id: 3,
        text: 'Auszahlung',
        icon: 'minus',
        content:
            '<form id="account-payout-form-container">' +
                '<div id="account-payout-form"></div>' +
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<h3>Auszahlung</h3>' +
                '<p id="result-text"></p>' +
            '</div>',
        func: AccountPayoutProc
    }, {
        id: 4,
        text: 'Konto löschen',
        icon: 'remove',
        content: 'Konto'
    }
];

const eTabs = $('#tabs > .tabs-container').dxTabs({
    dataSource: aTabs,
    selectedIndex: 0,
    onItemClick(e) {
        $('#tab-content').html(e.itemData.content);
        e.itemData.func();
    },
    onInitialized(e) {
        $('#tab-content').html(aTabs[0].content);
        aTabs[0].func();
    }
}).dxTabs('instance');