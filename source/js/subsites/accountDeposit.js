/**
 * Funktions-Variable zum Laden der Konto-Einzahlung
 */
let AccountDepositProc = function () {
    // Eingabeformular für Einzahlung
    let eForm = $('#account-deposit-form').dxForm({
        colCount: 1,
        items: [{
            itemType: 'group',
            caption: 'Einzahlung',
            colCount: 1,
            items: [{
                // Datenfeld zur Auswahl des Kontos
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
                // Datenfeld, welches den aktuellen Kontostand des ausgewählten Kontos anzeigt
                dataField: 'accountBalance',
                editorType: 'dxNumberBox',
                editorOptions: {
                    disabled: true,
                    format: ',##0.00 EUR',
                },
                label: {
                    text: 'Aktueller Kontostand'
                }
            }, {
                // Datenfeld für die Eingabe der Einzahlung
                dataField: 'accountDeposit',
                editorType: 'dxNumberBox',
                editorOptions: {
                    format: ',##0.00 EUR',
                    min: 0,
                    max: 1000000000
                },
                label: {
                    text: 'Einzahlung'
                },
                validationRules: [{ type: 'required' }]
            }, {
                // Button für Bestätigung
                itemType: 'button',
                buttonOptions: {
                    text: 'Einzahlen',
                    useSubmitBehavior: true
                }
            }]
        }]
    }).dxForm('instance');

    // Zeigt den aktuellen Kontostand im Datenfeld "aktueller Kontostand" an, wenn ein Konto ausgewählt wurde
    eForm.getEditor('accountID').on('valueChanged', function(e) {
        let aAccID = e.value;
        let iBalance = accManager.GetAccount(aAccID).Balance;

        // Guthaben anzeigen 
        eForm.getEditor('accountBalance').option('value', iBalance);
    });

    // Event, welches bei Knopfdruck ausgelöst wird
    $('#account-deposit-form-container').on('submit', function(e) {
        // Daten abholen
        let iAccountID = eForm.getEditor('accountID').option('value');
        let aAccount = accManager.GetAccount(iAccountID);
        let iBalance = eForm.getEditor('accountDeposit').option('value');

        if (iBalance > 0) {
            aAccount.Balance += iBalance;

            // Daten speichern
            accManager.SaveToLocalStorage();

            // Guthaben anzeigen 
            eForm.getEditor('accountBalance').option('value', aAccount.Balance);

            if (aAccount != null) {
                $('#result-accountOwner').text(aAccount.Name);
                $('#result-value').text(iBalance.toFixed(2));
                $('#result').show();    
            } else {
                $('#result').hide();
            }
        }

        // Standardevent verhindern
        e.preventDefault();
    });
}