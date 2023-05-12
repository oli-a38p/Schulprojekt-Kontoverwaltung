// Sprache automatisch einstellen
DevExpress.localization.locale(navigator.language);

// Verwaltungs-Objekt der Konten
let accManager = new AccountManager();

// Tab-Werte auf der Website
const aTabs = [
    {
        // Daten zum Tab "Neues Konto anlegen"
        id: 0,
        text: 'Neues Konto anlegen',
        icon: 'user',
        content: 
            '<form id="account-creation-form-container">' +
                '<div id="account-creation-form"></div>' + 
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<p id="result-text"></p>' +
            '</div>',
        func: AccountCreationProc // aufzurufende Funktion in accountCreation.js
    }, {
        // Daten zum Tab "Kontoauszug"
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
                '<p>Konto erstellt: <span class="text-bold" id="result-accountCreationDate"></span></p>' +
                '<p>Kontoname: <span class="text-bold" id="result-accountName"></span></p>' +
                '<p>Kontoinhaber: <span class="text-bold" id="result-accountOwner"></span></p>' +
                '<p>Guthaben: <span class="text-bold" id="result-accountBalance"></span></p>' +
            '</div>',
        func: AccountStatementProc // aufzurufende Funktion in accountStatement.js
    }, {
        // Daten zum Tab "Einzahlung"
        id: 2,
        text: 'Einzahlung',
        icon: 'add',
        content:
            '<form id="account-deposit-form-container">' +
                '<div id="account-deposit-form"></div>' +
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<p class="success-text">Dem Konto <span class="text-bold" id="result-accountOwner"></span> wurden <span class="text-bold" id="result-value"></span> EUR eingezahlt.</p>' +
            '</div>',
        func: AccountDepositProc // aufzurufende Funktion in accountDeposit.js
    }, {
        // Daten zum Tab "Auszahlung"
        id: 3,
        text: 'Auszahlung',
        icon: 'minus',
        content:
            '<form id="account-payout-form-container">' +
                '<div id="account-payout-form"></div>' +
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<p id="result-text"></p>' +
            '</div>',
        func: AccountPayoutProc // aufzurufende Funktion in accountPayout.js
    }, {
        // Daten zum Tab "Konto löschen"
        id: 4,
        text: 'Konto löschen',
        icon: 'remove',
        content:
            '<form id="account-deletion-form-container">' +
                '<div id="account-deletion-form"></div>' +
            '</form>' +
            '<div id="result">' +
                '<hr>' +
                '<p class="success-text">Das Konto <span id="result-accountName" class="text-bold"></span> des Inhabers <span id="result-accountOwner" class="text-bold"></span> wurde erfolgreich gelöscht!</p>' +
            '</div>',
        func: AccountDeletionProc
    }, {
        // Daten zum Tab "Systeminformationen"
        id: 5,
        text: 'Systeminformationen',
        icon: 'info',
        content:
            '<div class="sub-section">' +
            '<h3>Speicherverbrauch</h3>' +
            '<p>Angelegte Sparkonten: <span class="text-bold" id="count-savingAccounts"></span> / <span class="text-bold" id="count-maxSavingAccounts"></span></p>' +
            '<p>Angelegte Kontokorrentkonten: <span class="text-bold" id="count-checkingAccounts"></span> / <span class="text-bold" id="count-maxCheckingAccounts"></span></p>' +
            '<p>Freie Sparkonto-IDs: <span class="text-bold" id="count-freeSavingAccounts"></span></p>' +
            '<p>Freie Kontokorrentkonto-IDs: <span class="text-bold" id="count-freeCheckingAccounts"></span></p>' +
            '</div>' +
            '<hr>' +
            '<div class="sub-section">' +
            '<h3>Unterstützung</h3>' +
            '<p>Unterstützt durch <a href="https://js.devexpress.com/" target="_blank">DevExtreme JavaScript-Komponenten</a> Version <span class="text-bold" id="dx-version"></span> von DevExpress.</p>' +
            '</div>',
        func: SysInfo // aufzurufende Funktion in sysInfo.js
    }
];

// Komponente für die Tab-Navigation
const eTabs = $('#tabs > .tabs-container').dxTabs({
    dataSource: aTabs, // Tab-Daten
    selectedIndex: 0,
    onItemClick(e) {
        // Anzeige des Tab-Inhaltes
        $('#tab-content').html(e.itemData.content);
        e.itemData.func();
    },
    onInitialized(e) {
        // ersten Tab aufrufen, nachdem die Website geladen wurde
        $('#tab-content').html(aTabs[0].content);
        aTabs[0].func();
    }
}).dxTabs('instance');