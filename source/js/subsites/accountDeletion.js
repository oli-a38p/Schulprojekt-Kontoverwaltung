/**
 * Funktions-Variable zum Laden der Konto-Löschung
 */
let AccountDeletionProc = function () {
    let eForm = $('#account-deletion-form').dxForm({
        colCount: 1,
        items: [{
            itemType: 'group',
            caption: 'Konto löschen',
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
                // Button für Bestätigung
                itemType: 'button',
                buttonOptions: {
                    text: 'Löschen',
                    useSubmitBehavior: true
                }
            }]
        }]
    }).dxForm('instance');

    // Event, welches bei Knopfdruck ausgelöst wird
    $('#account-deletion-form-container').on('submit', function(e) {
        // Daten abholen
        let iAccountID = eForm.getEditor('accountID').option('value');
        let aAccount = accManager.GetAccount(iAccountID);

        if (aAccount != null) {
            let sName = aAccount.Name;
            let sOwner = aAccount.Owner;

            // Konto löschen
            accManager.RemoveAccount(iAccountID);
            eForm.getEditor('accountID').option('dataSource', accManager.AccountSelectionValues);

            // Ausgabe ausfüllen
            $('#result-accountName').text(sName);
            $('#result-accountOwner').text(sOwner);
            $('#result').show();
        }

        // Standardevent verhindern
        e.preventDefault();
    });
};