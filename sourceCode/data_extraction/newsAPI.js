"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
// newsAPI.ts
var database_1 = require("./database");
var NewsAPI = require('newsapi');
require('dotenv').config();
function getNews(teams) {
    return __awaiter(this, void 0, void 0, function () {
        var newsapi, _i, teams_1, team, result, _a, _b, article, date, publishedAtMain, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!process.env.NEWS_API_KEY) {
                        console.error("NEWS_API_KEY is not set in the environment variables.");
                        return [2 /*return*/];
                    }
                    newsapi = new NewsAPI(process.env.NEWS_API_KEY);
                    _i = 0, teams_1 = teams;
                    _c.label = 1;
                case 1:
                    if (!(_i < teams_1.length)) return [3 /*break*/, 10];
                    team = teams_1[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, newsapi.v2.everything({
                            q: team,
                            pageSize: 100,
                            language: 'en'
                        })];
                case 3:
                    result = _c.sent();
                    console.log("Number of articles for ".concat(team, ": ").concat(result.articles.length));
                    _a = 0, _b = result.articles;
                    _c.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    article = _b[_a];
                    date = new Date(article.publishedAt);
                    publishedAtMain = "".concat(date.getTime());
                    // Store article data in DynamoDB
                    return [4 /*yield*/, (0, database_1.saveNewsData)(article.title, publishedAtMain, team)];
                case 5:
                    // Store article data in DynamoDB
                    _c.sent();
                    console.log("Unix Time: ".concat(publishedAtMain, " ; title: ").concat(article.title, " ; Team: ").concat(team));
                    _c.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _c.sent();
                    console.error("Error fetching news for ".concat(team, ":"), error_1);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.getNews = getNews;
//# sourceMappingURL=newsAPI.js.map