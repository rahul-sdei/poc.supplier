import { CollectionObject } from "./collection-object.model";

export interface Booking extends CollectionObject {
    userId: string;
    tourId: string;
    tour: {
      title: string;
    };
    contactDetails: {
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      phoneNum: string;
      specialReq: string;
    };
    billingAddress: {
      addressLine1: string;
      addressLine2: string;
      town: string;
      state: string;
      postcode: string;
      country: string;
    };
    numOfTravellers: number;
    travellers: [
      {
        firstName: string;
        middleName: string;
        lastName: string;
        email: string;
        phoneNum: string;
        passport: {
          country: string;
          number: string;
        }
      }
    ];
    cardDetails: {
      name: string;
      cardNum: number;
      type: string;
      expiry: Date;
    };
    departureDate: Date;
    active: boolean;
    confirmed: boolean;
    cancelled: boolean;
    completed: boolean;
    cancellationReason: string;
    denied: boolean;
    deniedReason: string;
    deleted: boolean;
    createdAt: Date;
    modifiedAt: Date;
}
