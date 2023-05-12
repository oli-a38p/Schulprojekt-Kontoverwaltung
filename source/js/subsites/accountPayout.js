let AccountPayoutProc = function () {
    // Eingabeformular für Auszahlung
    let eForm = $('#account-payout-form').dxForm({
        colCount: 1,
        items: [{
            itemType: 'group',
            caption: 'Auszahlung',
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
                dataField: 'accountPayout',
                editorType: 'dxNumberBox',
                editorOptions: {
                    format: ',##0.00 EUR',
                    min: 0,
                    max: 1000000000
                },
                label: {
                    text: 'Auszuzahlender Wert'
                },
                validationRules: [{ type: 'required' }]
            }, {
                // Button für Bestätigung

                itemType: 'button',
                buttonOptions: {
                    text: 'Auszahlen',
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

    $('#account-payout-form-container').on('submit', function(e) {
        // Daten abholen
        let iAccountID = eForm.getEditor('accountID').option('value');
        let aAccount = accManager.GetAccount(iAccountID);
        let iBalance = eForm.getEditor('accountPayout').option('value');

        if (iBalance > 0) {
            if (aAccount.Balance >= iBalance) {
                aAccount.Balance -= iBalance;

                // Daten speichern
                accManager.SaveToLocalStorage();

                // Guthaben anzeigen 
                eForm.getEditor('accountBalance').option('value', aAccount.Balance);

                $('#result-text').html('<span class="success-text">Vom Konto <span class="text-bold" id="result-accountOwner"></span> wurden <span class="text-bold" id="result-value"></span> EUR ausgezahlt.</span>');
                $('#result-value').text(iBalance.toFixed(2));
            } else {
                // Nicht genügend Guthaben vorhanden
                $('#result-text').html('<span class="error-text">Das Konto <span class="text-bold" id="result-accountOwner"></span> besitzt nicht genügend Guthaben für diese Auszahlung.</span>');
            }

            $('#result-accountOwner').text(aAccount.Name);
            $('#result').show();
        }

        // Standardevent verhindern
        e.preventDefault();
    });
};