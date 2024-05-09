import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import { Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal } from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Interaction = Record({
    id: text,
    date: text,
    interaction_type: text,
    description: text,
    status: text,
    comments: text
});

const Purchase = Record({
    id: text,
    date: text,
    product: text,
    quantity: text,
    price: text,
});

const Customer = Record({
    id: text,
    name: text,
    company: text,
    email: text,
    phone: text,
    interactions: Vec(Interaction),
    purchases: Vec(Purchase)
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
    quantity: text,
    price: text,
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
});

const customerStorage = StableBTreeMap(0, text, Customer);
const interactionStorage = StableBTreeMap(1, text, Interaction);
const purchaseStorage = StableBTreeMap(2, text, Purchase);

export default Canister({
    getCustomers: query([], Vec(Customer), () => customerStorage.values()),

    getCustomer: query([text], Result(Customer, Message), (id) => {
        const customerOpt = customerStorage.get(id);
        return "Some" in customerOpt ? Ok(customerOpt.Some) : Err({ NotFound: `Customer with id=${id} not found` });
    }),

    addCustomer: update([CustomerPayload], Result(Customer, Message), (payload) => {
        if (Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "Invalid payload" });
        }
        const customer = { id: uuidv4(), ...payload, interactions: [], purchases: [] };
        customerStorage.insert(customer.id, customer);
        return Ok(customer);
    }),

    updateCustomer: update([Customer], Result(Customer, Message), (payload) => {
        const customerOpt = customerStorage.get(payload.id);
        return "Some" in customerOpt ?
            (customerStorage.insert(customerOpt.Some.id, payload), Ok(payload)) :
            Err({ NotFound: `Cannot update customer: Customer with id=${payload.id} not found` });
    }),

    deleteCustomer: update([text], Result(text, Message), (id) => {
        const deletedCustomerOpt = customerStorage.remove(id);
        return "Some" in deletedCustomerOpt ?
            Ok(deletedCustomerOpt.Some.id) :
            Err({ NotFound: `Cannot delete customer: Customer with id=${id} not found` });
    }),

    addInteraction: update([text, InteractionPayload], Result(text, Message), (customerId, payload) => {
        if (Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "Invalid payload" });
        }
        const interaction = { id: uuidv4(), ...payload };
        const customerOpt = customerStorage.get(customerId);
        return "Some" in customerOpt ?
            (customerOpt.Some.interactions.push(interaction), interactionStorage.insert(interaction.id, interaction), Ok(interaction.id)) :
            Err({ NotFound: `Cannot add interaction: Customer with id=${customerId} not found` });
    }),

    // Other methods follow similarly...

    // Filter Interaction by status
    filterByStatus: query([text], Vec(Interaction), (status) => interactionStorage.values().filter(interaction => interaction.status.toLowerCase() === status.toLowerCase())),

    // Search customer by name
    searchCustomerByName: query([text], Vec(Customer), (name) => customerStorage.values().filter(customer => customer.name.toLowerCase() === name.toLowerCase())),

    // get all purchases of a specific date
    getPurchasesByDate: query([text], Vec(Purchase), (date) => purchaseStorage.values().filter(purchase => purchase.date.toLowerCase() === date.toLowerCase())),

});

function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// Workaround to make uuid package work with Azle
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
