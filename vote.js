// 参与投票项目
Projects = new Meteor.Collection("projects");

// 设立的奖项
Awards = new Meteor.Collection("awards");

// 得分
Scores = new Meteor.Collection("scores");

// 投票人
Voters = new Meteor.Collection("voters");

if (Meteor.isClient) {
  Template.vote.voter = function () {
    return Session.get('voter');
  };

  Template.vote.projects = function () {
    return Projects.find({}, {sort: {score: -1, name: 1}});
  };

  Template.vote.selected_name = function () {
    var project = Projects.findOne(Session.get("selected_project"));
    return project && project.name;
  };

  Template.project.selected = function () {
    return Session.equals("selected_project", this._id ? "selected" : '');
  };

  Template.vote.events({
    'click input.inc': function () {
      if (Session.get('voter')) {
        // 是否已投
      } else {
        var name = $("input#voter").val().trim();
        Session.set('voter', name);
      }
      Projects.update(Session.get("selected_project"), {$inc: {score: 1}});
      Projects.update(Session.get("selected_project"), {$inc: {progress: 4}});
    },
  });

  Template.project.events({
    'click': function () {
      if (Session.get('voter')) {
        //
      } else {
        Session.set("selected_project",  this._id);
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Projects.find().count() === 0) {
      // 初始化设置队名
      var names = ["找你位队",
                   "爬虫队",
                   "开店123队",
                   "太极队",
                   "还没想好队",
                   "XX队",
                   "JS队",
                   "美女野兽队",
                   "约约队",
                   "超越梦想队",
                   "潜伏队",
                   "高端大气上档次",
                   "无名队"];

      for (var i = names.length - 1; i >= 0; i--) {
        Projects.insert({name: names[i], score: 0, progress: 0});
      };
    } else {
      // Projects.remove({});
    }
  });
}
