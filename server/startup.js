//remove any old configurations on startup
ServiceConfiguration.configurations.remove();

ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: Meteor.settings.twitter.public,
      loginStyle: "redirect",
      secret: Meteor.settings.twitter.private
    }
  }
);