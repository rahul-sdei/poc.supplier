import { Meteor } from 'meteor/meteor';

export interface User extends Meteor.User {
    username: string;
    emails: [
        {
            address: string;
            verified: boolean;
        }
    ];
    profile: {
        firstName: string;
        lastName: string;
        contact: string;
        imageId: string;
        imageUrl: string;
    },
    supplier: {
      companyName: string;
      ownerName: string;
      agentIdentity: {
        id: string;
        url: string;
        name: string;
        verified: boolean;
      };
      agentCertificate: {
        id: string;
        url: string;
        name: string;
        verified: boolean;
      };
    };
    active: boolean,
    deleted: boolean;
}
