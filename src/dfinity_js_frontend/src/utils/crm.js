

export async function createCustomer(customer) {
  return window.canister.crm.addCustomer(customer);
}

export async function getCustomers(){
  return window.canister.crm.getCustomers();
}

export async function getCustomer(id){
  return window.canister.crm.getCustomer(id);
}

export async function updateCustomer(customer){
  return window.canister.crm.updateCustomer(customer);
}

export async function deleteCustomer(id){
  return window.canister.crm.deleteCustomer(id);
}

// addInteraction
export async function addInteraction(customerId, interaction){
  return window.canister.crm.addInteraction(customerId, interaction);
}

// getCustomerInteractions
export async function getCustomerInteractions(customerId){
  return window.canister.crm.getCustomerInteractions(customerId);
}

// addPurchase
export async function addPurchase(customerId, purchase){
  return window.canister.crm.addPurchase(customerId, purchase);
}

// getCustomerPurchases
export async function getCustomerPurchases(customerId){
  return window.canister.crm.getCustomerPurchases(customerId);
}

// getPurchase
export async function getPurchase(purchaseId){
  return window.canister.crm.getPurchase(purchaseId);
}

// getInteraction
export async function getInteraction(interactionId){
  return window.canister.crm.getInteraction(interactionId);
}

// updateInteraction
export async function updateInteraction(interaction){
  return window.canister.crm.updateInteraction(interaction);
}

// deleteInteraction
export async function deleteInteraction(interactionId){
  return window.canister.crm.deleteInteraction(interactionId);
}

// updatePurchase
export async function updatePurchase(purchase){
  return window.canister.crm.updatePurchase(purchase);
}

// deletePurchase
export async function deletePurchase(purchaseId){
  return window.canister.crm.deletePurchase(purchaseId);
}

// filterByStatus
export async function filterByStatus(status){
  return window.canister.crm.filterByStatus(status);
}

// searchCustomerByName
export async function searchCustomerByName(name){
  return window.canister.crm.searchCustomerByName(name);
}


