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
                    valueExpr: null,
                    displayExpr: null,
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
            $('#result-text').html('<span class="success-text">Das Konto <span class="text-bold">' + sAccountName + '</span> (Kontonr. <span class="text-bold">' + aAccount.ID
                + '</span>) für den Besitzer <span class="text-bold">' + sAccountOwner + '</span> wurde erfolgreich erstellt.</span>');
        } else {
            $('#result-text').html('<span class="error-text">Das Konto konnte nicht angelegt werden. (' + accManager.LastError + ')</span>');
        }
        $('#result').show();

        // Standardevent verhindern
        e.preventDefault();
    });
};