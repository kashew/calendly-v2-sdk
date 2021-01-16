import faker from 'faker';
import { ConferenceStatus, CustomLocationEntity, GoogleConferenceEntity, GoToMeetingConferenceData, GoToMeetingConferenceEntity, InboundCallEntity, InPersonMeetingEntity, InviteeSpecifiedLocationEntity, MeetingLocationEntity, LocationType, MicrosoftTeamsConferenceData, MicrosoftTeamsConferenceEntity, OutboundCallEntity, ZoomConferenceDataEntity, ZoomConferenceEntity } from "../../src/types";

export default class LocationFactory {
  public static createEntity(locationType?: LocationType): MeetingLocationEntity {
    const randomLocationType = faker.random.arrayElement([
      LocationType.Custom,
      LocationType.GoToMeetingConference,
      LocationType.GoogleConference,
      LocationType.InPersonMeeting,
      LocationType.InboundCall,
      LocationType.InviteeSpecified,
      LocationType.MicrosoftTeamsConference,
      LocationType.OutboundCall,
      LocationType.ZoomConference
    ])

    locationType = locationType || randomLocationType

    switch (locationType) {
      case LocationType.Custom:
        return this.createCustomEntity()
      case LocationType.GoToMeetingConference:
        return this.createGoToMeetingConferenceEntity()
      case LocationType.GoogleConference:
        return this.createGoogleConferenceEntity()
      case LocationType.InPersonMeeting:
        return this.createInPersonMeetingEntity()
      case LocationType.InboundCall:
        return this.createInboundCallEntity()
      case LocationType.InviteeSpecified:
        return this.createInviteeSpecifiedEntity()
      case LocationType.MicrosoftTeamsConference:
        return this.createMicrosoftTeamsConferenceEntity()
      case LocationType.OutboundCall:
        return this.createOutboundCallEntity()
      case LocationType.ZoomConference:
        return this.createZoomConferenceEntity()
    }
  }

  private static createCustomEntity(): CustomLocationEntity {
    return {
      type: LocationType.Custom,
      location: faker.lorem.sentence()
    }
  }

  private static createGoToMeetingConferenceEntity(): GoToMeetingConferenceEntity {
    return {
      type: LocationType.GoToMeetingConference,
      status: this.getRandomConferenceStatus(),
      join_url: faker.internet.url(),
      data: this.createGoToMeetingConferenceData()
    }
  }

  private static createGoogleConferenceEntity(): GoogleConferenceEntity {
    return {
      type: LocationType.GoogleConference,
      status: this.getRandomConferenceStatus(),
      join_url: faker.internet.url()
    }
  }

  private static createInPersonMeetingEntity(): InPersonMeetingEntity {
    return {
      type: LocationType.InPersonMeeting,
      location: faker.lorem.sentence()
    }
  }

  private static createInboundCallEntity(): InboundCallEntity {
    return {
      type: LocationType.InboundCall,
      location: faker.lorem.sentence()
    }
  }

  private static createInviteeSpecifiedEntity(): InviteeSpecifiedLocationEntity {
    return {
      type: LocationType.InviteeSpecified,
      location: faker.lorem.sentence()
    }
  }

  private static createMicrosoftTeamsConferenceEntity(): MicrosoftTeamsConferenceEntity {
    return {
      type: LocationType.MicrosoftTeamsConference,
      status: this.getRandomConferenceStatus(),
      join_url: faker.internet.url(),
      data: this.createMicrosoftTeamsConferenceData()
    }
  }

  private static createOutboundCallEntity(): OutboundCallEntity {
    return {
      type: LocationType.OutboundCall,
      location: faker.lorem.sentence()
    }
  }

  private static createZoomConferenceEntity(): ZoomConferenceEntity {
    return {
      type: LocationType.ZoomConference,
      status: this.getRandomConferenceStatus(),
      join_url: faker.internet.url(),
      data: this.createZoomConferenceDataEntity()
    }
  }

  private static createGoToMeetingConferenceData(): GoToMeetingConferenceData {
    return {
      uniqueMeetingId: faker.random.number(),
      conferenceCallInfo: faker.lorem.sentence()
    }
  }

  private static createMicrosoftTeamsConferenceData(): MicrosoftTeamsConferenceData {
    return {
      id: faker.random.uuid(),
      audioConferencing: {
        conferenceId: faker.random.uuid(),
        dialinUrl: faker.internet.url(),
        tollNumber: faker.phone.phoneNumber()
      }
    }
  }

  private static createZoomConferenceDataEntity(): ZoomConferenceDataEntity {
    return {
      id: faker.random.uuid(),
      settings: {
        global_dial_in_numbers: [
          {
            number: faker.phone.phoneNumber(),
            country: faker.address.country(),
            type: faker.lorem.word(),
            city: faker.address.city(),
            country_name: faker.address.country()
          },
          {
            number: faker.phone.phoneNumber(),
            country: faker.address.country(),
            type: faker.lorem.word(),
            city: faker.address.city(),
            country_name: faker.address.country()
          },
          {
            number: faker.phone.phoneNumber(),
            country: faker.address.country(),
            type: faker.lorem.word(),
            city: faker.address.city(),
            country_name: faker.address.country()
          }
        ]
      },
      extra: {
        intl_numbers_url: faker.internet.url()
      },
      password: faker.internet.password()
    }
  }

  private static getRandomConferenceStatus(): ConferenceStatus {
    return faker.random.arrayElement([
      ConferenceStatus.Failed,
      ConferenceStatus.Initiated,
      ConferenceStatus.Processing,
      ConferenceStatus.Pushed
    ])
  }
}