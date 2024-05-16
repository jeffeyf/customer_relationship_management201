import { query, update, text, Record, StableBTreeMap, Variant, Vec, Ok, Err, ic, Principal, nat64, Result, Canister, nat } from "azle";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Interaction = Record({
    id: text,
    customerId: text,
    date: text,
    interaction_type: text,
    description: text,
    status: text,
    comments: text
});

const Purchase = Record({
    id: text,
    customerId: text,
    date: text,
    product: text,
    quantity: nat,
    price: nat,
});

const Customer = Record({
    id: text,
    name: text,
    company: text,
    email: text,
    phone: text,
    interactions: Vec(text),
    purchases: Vec(text)
});

const CustomerPayload = Record({
    name: text,
    company: text,
    email: text,
    phone: text,
});



const InteractionPayload = Record({
    date: text,
    interaction_type: text,
    description: text,
    status: text,
    comments: text
});

const PurchasePayload = Record({
    date: text,
    product: text,
    quantity: nat,
    price: nat,
});


const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
});

const customerStorage = StableBTreeMap(0, text, Customer);
const interactionStorage = StableBTreeMap(1, text, Interaction);
const purchaseStorage = StableBTreeMap(2, text, Purchase);



export default Canister({
  getCustomers: query([], Vec(Customer), () => {
    return customerStorage.values();
  }),

  getCustomer: query([text], Result(Customer, Message), (id) => {
    const customerOpt = customerStorage.get(id);
    if ("None" in customerOpt) {
      return Err({ NotFound: `customer with id=${id} not found` });
    }
    return Ok(customerOpt.Some);
  }),

  addCustomer: update(
    [CustomerPayload],
    Result(Customer, Message),
    (payload) => {
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
      }
      // @ts-ignore
      const validatePayloadErrors = validateCustomerPayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const customer = {
        id: uuidv4(),
        ...payload,
        interactions: [],
        purchases: [],
      };
      customerStorage.insert(customer.id, customer);
      return Ok(customer);
    }
  ),

  updateCustomer: update(
    [text, CustomerPayload],
    Result(Customer, Message),
    (id, payload) => {
      // @ts-ignore
      const validatePayloadErrors = validateCustomerPayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const customerOpt = customerStorage.get(id);
      if ("None" in customerOpt) {
        return Err({
          NotFound: `cannot update the customer: customer with id=${id} not found`,
        });
      }
      const updatedCustomer = { ...customerOpt.Some, ...payload };
      customerStorage.insert(customerOpt.Some.id, updatedCustomer);
      return Ok(updatedCustomer);
    }
  ),

  deleteCustomer: update([text], Result(text, Message), (id) => {
    const deletedCustomerOpt = customerStorage.remove(id);
    if ("None" in deletedCustomerOpt) {
      return Err({
        NotFound: `cannot delete the customer: customer with id=${id} not found`,
      });
    }
    return Ok(deletedCustomerOpt.Some.id);
  }),

  addInteraction: update(
    [text, InteractionPayload],
    Result(text, Message),
    (customerId, payload) => {
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
      }
      const customerOpt = customerStorage.get(customerId);
      if ("None" in customerOpt) {
        return Err({
          NotFound: `cannot add interaction: customer with id=${customerId} not found`,
        });
      }
      const interaction = { id: uuidv4(), customerId, ...payload };
      const customer = customerOpt.Some;
      customer.interactions.push(interaction.id);
      customerStorage.insert(customer.id, customer);
      interactionStorage.insert(interaction.id, interaction);
      return Ok(interaction.id);
    }
  ),

  getCustomerInteractions: query([text], Vec(Interaction), (customerId) => {
    const customerOpt = customerStorage.get(customerId);
    if ("None" in customerOpt) {
      return [];
    }
    return customerOpt.Some.interactions;
  }),

  addPurchase: update(
    [text, PurchasePayload],
    Result(text, Message),
    (customerId, payload) => {
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
      }
    // @ts-ignore
      const validatePayloadErrors = validatePurchasePayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const customerOpt = customerStorage.get(customerId);
      if ("None" in customerOpt) {
        return Err({
          NotFound: `cannot add purchase: customer with id=${customerId} not found`,
        });
      }
      const purchase = { id: uuidv4(), customerId, ...payload };
      const customer = customerOpt.Some;
      customer.purchases.push(purchase.id);
      customerStorage.insert(customer.id, customer);
      purchaseStorage.insert(purchase.id, purchase);
      return Ok(purchase.id);
    }
  ),

  getCustomerPurchases: query([text], Vec(Purchase), (customerId) => {
    const customerOpt = customerStorage.get(customerId);
    if ("None" in customerOpt) {
      return [];
    }
    return customerOpt.Some.purchases;
  }),

  getPurchase: query([text], Result(Purchase, Message), (id) => {
    const purchaseOpt = purchaseStorage.get(id);
    if ("None" in purchaseOpt) {
      return Err({ NotFound: `purchase with id=${id} not found` });
    }
    return Ok(purchaseOpt.Some);
  }),

  getInteraction: query([text], Result(Interaction, Message), (id) => {
    const interactionOpt = interactionStorage.get(id);
    if ("None" in interactionOpt) {
      return Err({ NotFound: `interaction with id=${id} not found` });
    }
    return Ok(interactionOpt.Some);
  }),

  updateInteraction: update(
    [text, InteractionPayload],
    Result(Interaction, Message),
    (id, payload) => {
      const interactionOpt = interactionStorage.get(id);
      if ("None" in interactionOpt) {
        return Err({
          NotFound: `cannot update the interaction: interaction with id=${id} not found`,
        });
      }
      const updatedInteraction = { ...interactionOpt.Some, ...payload };
      interactionStorage.insert(interactionOpt.Some.id, updatedInteraction);
      return Ok(updatedInteraction);
    }
  ),

  deleteInteraction: update([text], Result(text, Message), (id) => {
    const interactionOpt = interactionStorage.get(id);
    if ("None" in interactionOpt) {
      return Err({
        NotFound: `cannot delete the interaction: interaction with id=${id} not found`,
      });
    }
    const interaction = interactionOpt.Some;
    const customerOpt = customerStorage.get(interaction.customerId);
    if ("None" in customerOpt) {
      return Err({
        NotFound: `customer with id=${interaction.customerId} not found`,
      });
    }
    const customer = customerOpt.Some;
    customer.interactions.splice(
      customer.interactions.findIndex(
        (interactionId: text) => interaction.id === interactionId
      ),
      1
    );
    customerStorage.insert(customer.id, customer);
    interactionStorage.remove(id);
    return Ok(interaction.id);
  }),

  updatePurchase: update(
    [text, PurchasePayload],
    Result(Purchase, Message),
    (id, payload) => {
            // @ts-ignore
      const validatePayloadErrors = validatePurchasePayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const purchaseOpt = purchaseStorage.get(id);
      if ("None" in purchaseOpt) {
        return Err({
          NotFound: `cannot update the purchase: purchase with id=${id} not found`,
        });
      }
      const updatedPurchase = { ...purchaseOpt.Some, payload };
      purchaseStorage.insert(purchaseOpt.Some.id, updatedPurchase);
      return Ok(updatedPurchase);
    }
  ),

  deletePurchase: update([text], Result(text, Message), (id) => {
    const purchaseOpt = purchaseStorage.remove(id);
    if ("None" in purchaseOpt) {
      return Err({
        NotFound: `cannot delete the purchase: purchase with id=${id} not found`,
      });
    }
    const purchase = purchaseOpt.Some;
    const customerOpt = customerStorage.get(purchase.customerId);
    if ("None" in customerOpt) {
      return Err({
        NotFound: `customer with id=${purchase.customerId} not found`,
      });
    }
    const customer = customerOpt.Some;
    customer.purchases.splice(
      customer.purchases.findIndex(
        (purchaseId: text) => purchase.id === purchaseId
      ),
      1
    );
    customerStorage.insert(customer.id, customer);
    purchaseStorage.remove(id);
    return Ok(purchaseOpt.Some.id);
  }),

  // Filter Interaction by status
  filterByStatus: query([text], Vec(Interaction), (status) => {
    return interactionStorage
      .values()
      .filter(
        (interaction) =>
          interaction.status.toLowerCase() === status.toLowerCase()
      );
  }),

  // Search customer by name
  searchCustomerByName: query([text], Vec(Customer), (name) => {
    return customerStorage
      .values()
      .filter((customer) => customer.name.toLowerCase() === name.toLowerCase());
  }),

  // get all purchases of a specific date
  getPurchasesByDate: query([text], Vec(Purchase), (date) => {
    return purchaseStorage
      .values()
      .filter((purchase) => purchase.date.toLowerCase() === date.toLowerCase());
  }),
});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};



// Helper function that trims the input string and then checks the length
// The string is empty if true is returned, otherwise, string is a valid value
function isInvalidString(str: text): boolean {
    return str.trim().length == 0
  }

  // Helper function to ensure the input id meets the format used for ids generated by uuid
  function isValidUuid(id: string): boolean {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
}


  /**
  * Helper function to validate the CustomerPayload
  */
  function validateCustomerPayload(payload: typeof CustomerPayload): Vec<string>{
    const errors: Vec<text> = [];
    const phoneNumberRegex = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // @ts-ignore
    if (isInvalidString(payload.name)) {
      errors.push(`name='${payload.name}' cannot be empty.`);
    }
    // @ts-ignore
    if (isInvalidString(payload.company)) {
      errors.push(`company='${payload.company}' cannot be empty.`);
    }
    // @ts-ignore
    if (!phoneNumberRegex.test(payload.phone)) {
      errors.push(`phone='${payload.phone}' is not in the valid format.`);
    }
    // @ts-ignore
    if (!emailRegex.test(payload.email)) {
      errors.push(`email='${payload.email}' is not in the valid format.`);
    }
    return errors;
  }
  /**
  * Helper function to validate the PurchasePayload
  */
  function validatePurchasePayload(payload: typeof PurchasePayload): Vec<string>{
    const errors: Vec<text> = [];
    // @ts-ignore
    if (isInvalidString(payload.product)){
        errors.push(`product='${payload.product}' cannot be empty.`)
    }
    // @ts-ignore
    if (isInvalidString(payload.date)){
        errors.push(`date='${payload.date}' cannot be empty.`)
    }
    // @ts-ignore
    if (payload.quantity == BigInt(0)){
        errors.push(`quantity='${payload.quantity}' cannot be zero.`)
    }
    

    return errors;
  }

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};

