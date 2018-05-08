"use strict";
var appHelpers = appHelpers || {};
appHelpers.helpers = {
    isNotString: function(a) {
        return "string" != typeof a
    },
    chunk: function(a, b) {
        for (var c = [], d = 0; d < a.length; d += b) c.push(a.slice(d, d + b));
        return c
    },
    lessThan: function(a, b) {
        return function(c) {
            return !c[a] || c[a] < b
        }
    },
    footerAlign: function() {
        angular.element("footer").css("height", "auto");
        var a = angular.element("footer").outerHeight();
        angular.element("body").css("padding-bottom", a), angular.element("footer").css("height", a)
    }
}, angular.module("recyclingMain", ["ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "ngTouch", "mgcrea.ngStrap", "textAngular", "angularFileUpload"]).config(["$routeProvider", "USER_ROLES", function(a, b) {
    a.when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl"
    }).when("/guide", {
        templateUrl: "views/guide.html",
        controller: "GuideCtrl"
    }).when("/news", {
        templateUrl: "views/news.html",
        controller: "NewsCtrl"
    }).when("/contact-us", {
        templateUrl: "views/contact-us.html"
    }).when("/mission-history", {
        templateUrl: "views/mission-history.html"
    }).when("/facility-features", {
        templateUrl: "views/facility-features.html"
    }).when("/recycling-and-waste", {
        templateUrl: "views/recycling-and-waste.html"
    }).when("/confidential-shredding", {
        templateUrl: "views/confidential-shredding.html"
    }).when("/office-clean-out", {
        templateUrl: "views/office-clean-out.html"
    }).when("/organic-waste-diversion", {
        templateUrl: "views/organic-waste-diversion.html"
    }).when("/request-system", {
        templateUrl: "views/request-system.html",
        controller: "requestController"
    });
}]).factory("loadJSON", ["$http", function(a) {
    return {
        getBuildings: function() {
            return a({
                method: "GET",
                url: "data/building_export.json"
            })
        },
        buildings: [],
        getObjects: function() {
            return a({
                method: "GET",
                url: "data/objects.json"
            })
        },
        objects: [],
        getNews: function() {
            return a({
                method: "GET",
                url: "data/news.json"
            })
        },
        news: []
    }
}]).controller("DataCtrl", ["$scope", "$location", "$rootScope", "$anchorScroll", "$http", "$modal", "loadJSON", "AuthService", "AUTH_EVENTS", "USER_ROLES", "Session", function(a, b, c, d, e, f, g, h, i, j, k) {
    a.helpers = appHelpers.helpers, a.currentUser = null, a.userRoles = j, a.isAuthorized = h.isAuthorized, a.setCurrentUser = function(b) {
        a.currentUser = b
    }, a.$on(i.loginSuccess, a.setCurrentUser(k));
    var l = f({
            templateUrl: "views/modals/login.html",
            backdrop: "static",
            show: !1
        }),
        m = function() {
            l.$promise.then(l.show)
        };
        a.showLogin = function() {
            l.$promise.then(l.show)
        }
    a.$on(i.notAuthenticated, m), a.$on(i.sessionTimeout, m), a.scrollToHash = function(a) {
        b.hash(a), d()
    }, angular.element(window).resize(function() {
        a.helpers.footerAlign()
    }), c.$on("$includeContentLoaded", function(b, c) {
        "views/components/component-footer.html" === c && a.helpers.footerAlign()
    })
}]).filter("myLimitTo", function() {
    return function(a, b, c) {
        return a.slice(c, c + b)
    }
}).filter("startFrom", function() {
    return function(a, b) {
        return b = +b, a.slice(b)
    }
}).config(["$typeaheadProvider", function(a) {
    angular.extend(a.defaults, {
        minLength: 2,
        limit: 8,
        autoSelect: !1
    })
}]).service("lastGuideSearch", function() {
    this.create = function(a, b, c, d) {
        this.search = a, this.commodity = b, this.buildingId = c, this.buildingName = d
    }, this.destroy = function() {
        this.search = null, this.commodity = null, this.buildingId = null, this.buildingName = null
    }
}), angular.module("recyclingMain").config(["$httpProvider", function(a) {
    a.defaults.withCredentials = !0
}]).controller("LoginCtrl", ["$scope", "$rootScope", "$http", "AUTH_EVENTS", "AuthService", "formHash", function(a, b, c, d, e, f) {
    a.credentials = {
        username: "",
        password: "",
        csrf: ""
    }, f.generate().then(function(b) {
        a.credentials.csrf = b.data.csrf
    }), a.login = function(a) {
        f.validate(a.csrf).then(function(c) {
            c.data && e.login(a).then(function() {
                b.$broadcast(d.loginSuccess)
            }, function() {
                b.$broadcast(d.loginFailed)
            })
        })
    }
}]).factory("formHash", ["$http", function(a) {
    return {
        generate: function() {
            return a.post("http://35.9.51.36/filemaker_api/recycle_functions/AuthController.php", {
                do: "generateFormHash",
                args: ""
            })
        },
        validate: function(b) {
            return a.post("http://35.9.51.36/filemaker_api/recycle_functions/AuthController.php", {
                do: "validateFormHash",
                args: {
                    csrf: b
                }
            })
        }
    }
}]).constant("AUTH_EVENTS", {
    loginSuccess: "auth-login-success",
    loginFailed: "auth-login-failed",
    logoutSuccess: "auth-logout-success",
    sessionTimeout: "auth-session-timeout",
    notAuthenticated: "auth-not-authenticated",
    notAuthorized: "auth-not-authorized"
}).constant("USER_ROLES", {
    admin: "admin",
    editor: "editor",
    guest: "guest"
}).service("Session", function() {
    this.create = function(a, b, c, d) {
        this.sesh = a, this.id = b, this.username = c, this.role = d, this.name = name
    }, this.destroy = function() {
        this.sesh = null, this.id = null, this.username = null, this.role = null, this.name = null
    }
}).factory("AuthService", ["$http", "Session", function(a, b) {
    var c = {};
    return c.login = function(c) {
        var d = {
            do: "validateAndGet",
            args: {
                user: c.username,
                pass: c.password
            }
        };
        return a.post("http://35.9.51.36/filemaker_api/recycle_functions/AuthController.php", d).then(function(a) {
            if (!a.data.error && (console.log(a.data), a.data.user)) return b.create(a.data.user.Session, a.data.user.zz__ID, a.data.user.Username, a.data.user.Role), a.data.user
        })
    }, c.isAuthenticated = function() {
        return !!b.userId
    }, c.isAuthorized = function(a) {
        return angular.isArray(a) || (a = [a]), c.isAuthenticated() && -1 !== a.indexOf(b.userRole)
    }, c
}]).run(["$rootScope", "AUTH_EVENTS", "AuthService", function(a, b, c) {
    a.$on("$routeChangeStart", function(d, e) {
        if (e.data) {
            var f = e.data.authorizedRoles;
            c.isAuthorized(f) || (d.preventDefault(), c.isAuthenticated() ? a.$broadcast(b.notAuthorized) : a.$broadcast(b.notAuthenticated))
        }
    })
}]), void 0 === Number.prototype.toRadians && (Number.prototype.toRadians = function() {
    return this * Math.PI / 180
}), void 0 === Number.prototype.toDegrees && (Number.prototype.toDegrees = function() {
    return 180 * this / Math.PI
}), angular.module("recyclingMain").controller("MainCtrl", ["$scope", "$http", "$rootScope", "$alert", "$location", "loadJSON", "lastGuideSearch", function(a, b, c, d, e, f, g) {
    f.getBuildings().success(function(b) {
        f.buildings = b, a.buildings = f.buildings
    }), f.getObjects().success(function(b) {
        f.objects = b, a.objects = f.objects
    }), a.searchSanitize = {
        checkObject: function(b) {
            "object" != typeof b && b ? (a.guideSearchForm.$valid = !1, a.guideSearchForm.$invalid = !0, h.show(), a.objects.forEach(function(c) {
                b.toLowerCase() === c.name.toLowerCase() && (a.guideSearch.object = c, a.guideSearchForm.$valid = !0, a.guideSearchForm.$invalid = !1, h.hide())
            })) : b ? (a.guideSearchForm.$valid = !0, a.guideSearchForm.$invalid = !1, h.hide()) : (a.guideSearchForm.$valid = !1, a.guideSearchForm.$invalid = !0)
        },
        checkBuilding: function(b) {
            "object" != typeof b && b ? (a.guideSearchForm.$valid = !1, a.guideSearchForm.$invalid = !0, i.show(), a.buildings.forEach(function(c) {
                b.toLowerCase() === c.Building_Name.toLowerCase() && (a.guideSearch.building = c, a.guideSearchForm.$valid = !0, a.guideSearchForm.$invalid = !1, i.hide())
            })) : b ? (a.guideSearchForm.$valid = !0, a.guideSearchForm.$invalid = !1, i.hide()) : a.guideSearchForm.$invalid = !1
        }
    }, a.queryGuide = function(a) {
        a.building ? (e.path("/guide").search({
            commodity: a.object.commodity,
            building: a.building.Building_ID
        }), g.create(a.object.name, a.object.commodity, a.building.Building_ID, a.building.Building_Name)) : (e.path("/guide").search({
            commodity: a.object.commodity
        }), g.create(a.object.name, a.object.commodity))
    };
    var h = d({
            title: "Guide Search:",
            content: "The item you entered was not found. Continue for a list of general recycling locations.",
            type: "danger",
            container: ".object-search-alert",
            show: !1
        }),
        i = d({
            title: "Guide Search:",
            content: "The building you entered was not found. Continue for a list of general recycling locations.",
            type: "danger",
            container: ".building-search-alert",
            show: !1
        })
}]), angular.module("recyclingMain").controller("GuideCtrl", ["$scope", "$location", "loadJSON", "lastGuideSearch", function(a, b, c, d) {
    a.buildings = c.buildings, a.objects = c.objects, a.sorter = "Building_Name", a.lastSearch = d.search, d.search && (d.buildingId ? b.path("/guide").search({
        commodity: d.commodity,
        building: d.buildingId
    }) : b.path("/guide").search({
        commodity: d.commodity
    })), console.log(d), a.distanceOfCoords = function(a, b, c, d) {
        if (a && b && c && d) {
            var e = a.toRadians(),
                f = c.toRadians(),
                g = (c - a).toRadians(),
                h = (d - b).toRadians(),
                i = Math.sin(g / 2) * Math.sin(g / 2) + Math.cos(e) * Math.cos(f) * Math.sin(h / 2) * Math.sin(h / 2);
            return 6371e3 * (2 * Math.atan2(Math.sqrt(i), Math.sqrt(1 - i))) / 1e3 / 1.609344
        }
        return NaN
    }, a.calculateSearchRadius = function(b, c) {
        var d = [],
            e = [];
        d = b.GPS_Coords.split(/,|\s/).length > 2 ? b.GPS_Coords.split(/,\s/) : b.GPS_Coords.split(/,|\s/), angular.forEach(c, function(b) {
            e = b.GPS_Coords.split(/,|\s/).length > 2 ? b.GPS_Coords.split(/,\s/) : b.GPS_Coords.split(/,|\s/), b.GPS_Latitude = e[0], b.GPS_Longitude = e[1], b.distanceFromOrigin = a.distanceOfCoords(Number(b.GPS_Latitude), Number(b.GPS_Longitude), Number(d[0]), Number(d[1]))
        }), a.sorter = "distanceFromOrigin"
    }, a.selectCommodity = function(b) {
        a.commodityFilter = {
            CommodityCollected: b
        }, a.selectedCommodity = b
    }, Object.keys(b.search()).length ? (a.commodityFilter = {
        CommodityCollected: b.search().commodity
    }, a.selectedCommodity = b.search().commodity, b.search().building && (a.origin = a.buildings.filter(function(a) {
        return a.Building_ID === b.search().building
    }), a.origin = a.origin[0], a.calculateSearchRadius(a.origin, a.buildings))) : angular.forEach(a.buildings, function(a) {
        a.distanceFromOrigin = ""
    })
}]), angular.module("recyclingMain").controller("ServicesCtrl", ["$scope", "$location", "$anchorScroll", "$http", function(a, b, c, d) {
    a.scrollToHash = function(a) {
        b.hash(a), c()
    }, a.addService = function(b) {
        b.description ? (a.services.unshift(b), a.newService = {}, a.newServiceForm.$setPristine()) : console.log("error adding a new service")
    }, d.get("data/services.json").success(function(b) {
        a.services = b
    })
}]), angular.module("recyclingMain").controller("WasteWarCtrl", ["$scope", "$location", "$anchorScroll", "$modal", function(a, b, c, d) {
    var e = d({
        templateUrl: "views/modals/pledge.html",
        controller: "PledgeCtrl",
        backdrop: !0,
        show: !1
    });
    a.showPledge = function() {
        e.$promise.then(e.show)
    }, a.scrollToHash = function(a) {
        b.hash(a), c()
    }
}]).controller("PledgeCtrl", ["$scope", function(a) {
    a.signPledge = function(a) {
        console.log(a)
    }
}]), angular.module("recyclingMain").controller("CommodityCtrl", ["$scope", "$location", "$anchorScroll", function(a, b, c) {
    a.scrollToHash = function(a) {
        b.hash(a), c()
    }
}]), angular.module("recyclingMain").controller("NewsCtrl", ["$scope", "$http", "$location", "loadJSON", function($scope, $http, $location, loadJSON) {
    loadJSON.getNews().success(function(data) {
        loadJSON.news = data;
        $scope.news = [];
        for (var i = 0; i < data.length; i++) {
            $scope.news.push(json2html.transform({}, loadJSON.news[i]));
        }
    });
}]), angular.module("recyclingMain").controller("CMSCtrl", ["$scope", "$http", "$location", "$alert", "FileUploader", "formHash", function(a, b, c, d, e, f) {
    function g(a, b) {
        var c = setInterval(a, b);
        this.stop = function() {
            return c && (clearInterval(c), c = null), this
        }, this.start = function() {
            return c || (this.stop(), c = setInterval(a, b)), this
        }, this.reset = function(a) {
            return console.log("reset timer"), b = a, this.stop().start()
        }
    }

    function h(a, b, c) {
        var d = new Image;
        d.src = a.target.result, d.width === d.height ? (b.uploadItem(c), j.hide()) : (b.removeFromQueue(c), j.show())
    }
    a.newPost = {
        article: {}
    }, a.editPost = {
        article: {}
    }, f.generate().then(function(b) {
        console.log(b), a.newPost.csrf = b.data.csrf, a.editPost.csrf = b.data.csrf
    }), a.currentPage = 0, a.pageSize = 10, a.news = [];
    var i = {
        do: "getAllNews",
        args: "args"
    };
    b.post("http://35.9.51.36/filemaker_api/recycle_functions/EditorController.php", i).then(function(b) {
        a.news = b.data.res, a.chunkedNews = a.helpers.chunk(a.news, 3)
    }), a.numberOfPages = function() {
        return Math.ceil(a.news.length / a.pageSize)
    }, a.countDrafts = function() {
        var b = 0;
        return angular.forEach(a.news, function(a) {
            a.Status && "draft" !== a.Status || (a.Status = "draft", b++)
        }), b
    }, a.addNews = function(c) {
        var d = {
                do: "addNews",
                args: {
                    csrf: c.csrf,
                    newsArray: c.article
                }
            },
            e = new Date;
        c.article.DatePosted = e.toJSON(), b.post("http://35.9.51.36/filemaker_api/recycle_functions/EditorController.php", d).then(function(b) {
            "success" === b.data.res && a.news.unshift(c.article)
        }), a.editThis(c.article), a.newPost = {
            article: {}
        }, a.newPostForm.$setPristine()
    }, a.saveEdit = function(c) {
        c.saved = !0;
        var d = {
            do: "editNews",
            args: {
                csrf: c.csrf,
                newsArray: c.article
            }
        };
        b.post("http://35.9.51.36/filemaker_api/recycle_functions/EditorController.php", d).then(function(b) {
            "success" === b.data.res && angular.copy(c.article, a.news[c.index])
        }), a.editPostForm.$setPristine()
    }, a.autosave = new g(function() {
        a.editMode && a.editPostForm.$dirty && (console.log("saving edit"), a.saveEdit(a.editPost))
    }, 3e4), a.$on("$destroy", function() {
        a.autosave.stop()
    }), a.makeUrlTitle = function(a) {
        a.Title && (a.TitleURL = a.Title.replace(/\s/g, "-").toLowerCase())
    }, a.makeLeadText = function(a) {
        return a.match(/(<p.+?<\/p>)/, "$1")[0]
    }, a.editThis = function(b, c) {
        a.editPost.index = c, angular.copy(b, a.editPost.article), a.editPostForm.$setPristine(), a.editMode = !0
    }, a.cancelPost = function() {
        a.editMode && (a.editMode = !a.editMode, a.editPost.article = {}, a.editPostForm.$setPristine()), a.createNew && (a.createNew = !a.createNew, a.newPost.article = {}, a.newPostForm.$setPristine())
    }, a.newThumbUploader = new e({
        url: "http://35.9.51.36/filemaker_api/recycle_functions/upload.php"
    }), a.newThumbUploader.onAfterAddingFile = function(a) {
        console.info("onAfterAddingFile", a);
        var b = new FileReader;
        b.onload = h(event, this, a), b.readAsDataURL(a._file)
    }, a.newThumbUploader.onSuccessItem = function(b, c) {
        a.newPost.article.Thumbnail = c.url, a.newPostForm.$pristine && a.newPostForm.$setDirty(), a.newThumbUploader.clearQueue()
    }, a.editThumbUploader = new e({
        url: "http://35.9.51.36/filemaker_api/recycle_functions/upload.php",
        formData: [{
            do: "uploadImage",
            args: ""
        }]
    }), a.editThumbUploader.onAfterAddingFile = function(a) {
        console.info("onAfterAddingFile", a);
        var b = new FileReader;
        b.onload = h(event, this, a), b.readAsDataURL(a._file)
    }, a.editThumbUploader.onSuccessItem = function(b, c) {
        a.editPost.article.Thumbnail = c.url, a.editPostForm.$pristine && a.editPostForm.$setDirty(), a.editThumbUploader.clearQueue()
    }, a.deleteThumb = function(a) {
        a.Thumbnail = ""
    };
    var j = d({
        content: "Image must be a perfect square.",
        type: "danger",
        container: ".square-thumb-alert",
        show: !1
    })
}]).controller("UploadImageModalInstance", ["$scope", "FileUploader", function(a, b) {
    a.progress = 0, a.files = [], a.uploader = new b({
        url: "http://35.9.51.36/filemaker_api/recycle_functions/upload.php"
    })
}]).service("$imageUpload", ["$modal", "$rootScope", "$q", function(a, b, c) {
    var d, e = b.$new();
    e.title = "imageUpload", e.answer = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var e = a[c]._file.name;
            b.push("http://35.9.51.36/filemaker_api/recycle_functions/uploads/" + e)
        }
        d.resolve(b), f.hide()
    };
    var f = a({
            templateUrl: "views/modals/upload.html",
            controller: "UploadImageModalInstance",
            scope: e,
            show: !1
        }),
        g = f.show;
    return f.show = function() {
        return d = c.defer(), g(), d.promise
    }, f
}]).config(["$provide", function(a) {
    a.decorator("taOptions", ["taRegisterTool", "$delegate", "$modal", "$imageUpload", function(a, b, c, d) {
        return a("uploadImage", {
            buttontext: "Upload Image(s)",
            iconclass: "fa fa-image",
            action: function(a, b) {
                return d.show().then(function(c) {
                    b();
                    for (var d = 0; d < c.length; d++) document.execCommand("insertImage", !0, c[d]);
                    a.resolve()
                }, function() {
                    a.resolve()
                }), !1
            }
        }), b.toolbar = [
            ["h2", "p", "pre", "quote"],
            ["redo", "undo", "clear"],
            ["bold", "italics", "underline", "strikeThrough", "ul", "ol"],
            ["html", "uploadImage", "insertLink", "insertVideo"],
            ["wordcount", "charcount"]
        ], b
    }])
}]).directive("ngThumb", ["$window", function(a) {
    var b = {
        support: !(!a.FileReader || !a.CanvasRenderingContext2D),
        isFile: function(b) {
            return angular.isObject(b) && b instanceof a.File
        },
        isImage: function(a) {
            return -1 !== "|jpg|png|jpeg|bmp|gif|".indexOf("|" + a.type.slice(a.type.lastIndexOf("/") + 1) + "|")
        }
    };
    return {
        restrict: "A",
        template: "<canvas/>",
        link: function(a, c, d) {
            function e(a) {
                var b = new Image;
                b.onload = f, b.src = a.target.result
            }

            function f() {
                var a = g.width || this.width / this.height * g.height,
                    b = g.height || this.height / this.width * g.width;
                h.attr({
                    width: a,
                    height: b
                }), h[0].getContext("2d").drawImage(this, 0, 0, a, b)
            }
            if (b.support) {
                var g = a.$eval(d.ngThumb);
                if (b.isFile(g.file) && b.isImage(g.file)) {
                    var h = c.find("canvas"),
                        i = new FileReader;
                    i.onload = e, i.readAsDataURL(g.file)
                }
            }
        }
    }
}]), angular.module("recyclingMain").controller("ArticleCtrl", ["$scope", "$http", "$location", function(a, b, c) {
    var d = c.url(),
        e = d.replace("/article/", "");
    a.news = [], a.article = [];
    var f = {
        do: "getActiveNews",
        args: ""
    };
    b.post("http://35.9.51.36/filemaker_api/recycle_functions/EditorController.php", f).then(function(b) {
        a.news = b.data.res, a.article = a.news.filter(function(a) {
            return a.TitleURL.toLowerCase() === e
        }), a.article = a.article[0], a.tags = a.article.META_keywords.split(","), a.otherArticles = a.news.filter(function(b) {
            for (var c = a.tags, d = 0; d < c.length; d++)
                if (-1 !== b.META_keywords.indexOf(c[d])) return b.TitleURL.toLowerCase() !== e
        })
    })
}]).filter("inArray", function() {
    return function(a, b) {
        var c, d, e, f = [];
        if (a)
            for (d = 0; d < a.length; d++)
                for (c = a[d], e = 0; e < b.length; e++)
                    if (-1 !== c.META_keywords.indexOf(b[e])) {
                        f.push(c);
                        break
                    }
        return f
    }
}).directive("ajaxCloak", ["$interval", "$http", function(a, b) {
    return {
        restrict: "A",
        link: function(c, d, e) {
            var f = a(function() {
                0 === b.pendingRequests.length && (a.cancel(f), e.$set("ajaxCloak", void 0), d.removeClass("ajax-cloak"))
            }, 100)
        }
    }
}]), angular.module("recyclingMain").controller("requestController", ["$scope", "$http", "$location", function($scope, $http, $location) {

}]);
