// 参与投票项目
Projects = new Meteor.Collection("projects");

// 投票人
Voters = new Meteor.Collection("voters");

if (Meteor.isClient) {
  Template.vote.voter = function () {
    return Session.get('voter');
  };

  Template.vote.voted = function () {
    return Session.get("voted");
  };

  Template.vote.projects = function () {
    return Projects.find({}, {sort: {score: -1, name: 1}});
  };

  Template.vote.voters = function () {
    return Voters.find({}, {sort: {created: -1, name: 1}});
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
      var name = Session.get("voter");
      if (name) {
      } else {
        var name = $("input#voter").val().trim();
        if (name) {
          Session.set('voter', name);
          Session.set('voted', true);
        } else {
            // 输入姓名为空
            return;
        }
      }
      // 设置分数和进度
      Projects.update(Session.get("selected_project"), {$inc: {score: 1, progress: 4}});
      
      // 增加投票记录
      project = Projects.findOne(Session.get("selected_project"));
      Voters.insert({voter: name, project: project.name, created: Date.now()});
    },
  });

  Template.project.events({
    'click': function () {
      Session.set("selected_project",  this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Voters.remove({});

    //  换奖项
    //  Projects.update({}, {$set: {score: 0, progress: 0}}, {multi: true});

    // 换项目
    var change = true; 
    if (change) {
      var names = ["东池", "健康食坊", "一步味道", "秦唐面道", "汪家木桶饭", "家常菜", "仔皇煲", "真功夫", "嘉旺"];
    } else {
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
    }

    if (Projects.find().count() === 0) {
      for (var i = names.length - 1; i >= 0; i--) {
        Projects.insert({name: names[i], score: 0, progress: 0, created: Date.now()});
      };
    } else {
      // Projects.remove({});
      // Voters.remove({});
      console.log('hanker');
    }
  });
}
