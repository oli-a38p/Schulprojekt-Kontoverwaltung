/**
 * Funktions-Variable zum Laden der Systeminformation
 */
let SysInfo = function () {
    // Ausfüllung des Speicherverbrauchs
    $('#count-savingAccounts').text(accManager.SavingAccounts.AccountList.length);
    $('#count-maxSavingAccounts').text(accManager.SavingAccounts.TotalAvailableSpace);
    $('#count-checkingAccounts').text(accManager.CheckingAccounts.AccountList.length);
    $('#count-maxCheckingAccounts').text(accManager.CheckingAccounts.TotalAvailableSpace);
    $('#count-freeSavingAccounts').text(accManager.SavingAccounts.FreeSpace);
    $('#count-freeCheckingAccounts').text(accManager.CheckingAccounts.FreeSpace);

    // DevExpress-Version eintragen
    $('#dx-version').text(DevExpress.VERSION);
}