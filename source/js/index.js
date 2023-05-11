$(() => {
    let accManager = new AccountManager();

    let AccountCreationProc = function () {
        // Eingabeformular für Kontoerstellung
        let eForm = $('#account-creation-form').dxForm({
            colCount: 1,
            items: [{
                itemType: 'group',
                caption: 'Konto erstellen',
                colCount: 1,
                items: [{
                    dataField: 'accountType',
                    isRequired: true,
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        // Datenquelle
                        dataSource: new DevExpress.data.DataSource({
                            store: AccountTypesVisible,
                            paginate: true,
                            pageSize: 10,
                            sort: [  
                                { desc: false }  
                            ] 
                        }),
                        searchEnabled: true
                    },
                    label: {
                        text: 'Kontotyp'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    dataField: 'accountName',
                    editorType: 'dxTextBox',
                    label: {
                        text: 'Kontoname'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    dataField: 'accountOwner',
                    editorType: 'dxTextBox',
                    label: {
                        text: 'Kontoinhaber'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    // Button für Bestätigung

                    itemType: 'button',
                    buttonOptions: {
                        text: 'Konto anlegen',
                        useSubmitBehavior: true
                    }
                }]
            }]
        }).dxForm('instance');

        $('#account-creation-form-container').on('submit', function(e) {
            // Daten abholen
            let sAccountType = eForm.getEditor('accountType').option('value');
            let sAccountOwner = eForm.getEditor('accountOwner').option('value');
            let sAccountName = eForm.getEditor('accountName').option('value');
            let atAccountType = AccountTypeName.indexOf(sAccountType);

            // Konto anlegen
            aAccount = accManager.AddAccount(atAccountType, sAccountName, sAccountOwner);
            if (aAccount != null) {
                $('#result-text').html('<span class="success-text">Das Konto "' + sAccountName + '" (Kontonr. ' + aAccount.ID + ') für den Besitzer ' + sAccountOwner + ' wurde erfolgreich erstellt.</span>');
            } else {
                $('#result-text').html('<span class="error-text">Das Konto konnte nicht angelegt werden. (' + accManager.LastError + ')</span>');
            }
            $('#result').show();

            // Standardevent verhindern
            e.preventDefault();
        });
    };

    let AccountStatementProc = function () {
        // Eingabeformular für Kontoauszug
        let eForm = $('#account-statement-form').dxForm({
            colCount: 1,
            items: [{
                itemType: 'group',
                caption: 'Kontoauszug erstellen',
                colCount: 1,
                items: [{
                    dataField: 'accountID',
                    isRequired: true,
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        // Datenquelle
                        dataSource: new DevExpress.data.DataSource({
                            store: accManager.AccountSelectionValues,
                            paginate: true,
                            pageSize: 10,
                            sort: [  
                                { desc: false }  
                            ] 
                        }),
                        valueExpr: 'ID',
                        displayExpr: 'displayText',
                        searchEnabled: true
                    },
                    label: {
                        text: 'Konto auswählen'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    // Button für Bestätigung

                    itemType: 'button',
                    buttonOptions: {
                        text: 'Kontoauszug erstellen',
                        useSubmitBehavior: true
                    }
                }]
            }]
        }).dxForm('instance');

        $('#account-statement-form-container').on('submit', function(e) {
            // Daten abholen
            let iAccountID = eForm.getEditor('accountID').option('value');
            let aAccount = accManager.GetAccount(iAccountID);

            if (aAccount != null) {
                $('#result-accountID').text(aAccount.ID);
                $('#result-accountType').text(AccountTypeName[aAccount.Type]);
                $('#result-accountCreationDate').text(aAccount.CreationDateString);
                $('#result-accountName').text(aAccount.Name);
                $('#result-accountOwner').text(aAccount.Owner);
                $('#result-accountBalance').text(aAccount.Balance.toFixed(2) + ' EUR');
                $('#result').show();
            } else {
                $('#result').hide();
            }

            // Standardevent verhindern
            e.preventDefault();
        });
    };

    let AccountDepositProc = function () {
        // Eingabeformular für Einzahlung
        let eForm = $('#account-deposit-form').dxForm({
            colCount: 1,
            items: [{
                itemType: 'group',
                caption: 'Einzahlung',
                colCount: 1,
                items: [{
                    dataField: 'accountID',
                    isRequired: true,
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        // Datenquelle
                        dataSource: new DevExpress.data.DataSource({
                            store: accManager.AccountSelectionValues,
                            paginate: true,
                            pageSize: 10,
                            sort: [  
                                { desc: false }  
                            ] 
                        }),
                        valueExpr: 'ID',
                        displayExpr: 'displayText',
                        searchEnabled: true
                    },
                    label: {
                        text: 'Konto auswählen'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    dataField: 'accountBalance',
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        disabled: true,
                        format: ',##0.00 EUR',
                    },
                    label: {
                        text: 'Vorhandenes Guthaben'
                    }
                }, {
                    dataField: 'accountDeposit',
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        format: ',##0.00 EUR',
                    },
                    label: {
                        text: 'Einzuzahlender Wert'
                    },
                    validationRules: [{ type: 'required' }]
                }, {
                    // Button für Bestätigung

                    itemType: 'button',
                    buttonOptions: {
                        text: 'Kontoauszug erstellen',
                        useSubmitBehavior: true
                    }
                }]
            }]
        }).dxForm('instance');

        eForm.getEditor('accountID').on('valueChanged', function(e) {
            let aAccID = e.value;
            let iBalance = accManager.GetAccount(aAccID).Balance;

            // Guthaben anzeigen
            eForm.getEditor('accountBalance').option('value', iBalance);
        });
    }

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
                '</form>',
            func: AccountDepositProc
        }, {
            id: 3,
            text: 'Auszahlung',
            icon: 'minus',
            content: 'Auszahlung'
        }, {
            id: 4,
            text: 'Konto löschen',
            icon: 'remove',
            content: 'Konto '
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
});