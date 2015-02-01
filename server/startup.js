ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: Meteor.settings.twitter.public,
      loginStyle: "popup",
      secret: Meteor.settings.twitter.private
    }
  }
);