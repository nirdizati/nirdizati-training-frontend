'use strict'
/* global angular */

var app = angular.module('angularMaterialAdmin');

//---------------time related predictions------------------------//
//intercase
//--training
app.service('Prediction', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/index', {});
});
//--results
app.service('PredictionResults', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/results', {});
});
app.service('PredictionGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/general', {});
});
app.service('PredictionEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'services/evaluation', {});
});

//timeseries
//--training and results
app.service('ForecastingTimeGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/general', {});
});
app.service('ForecastingTimeEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/evaluation', {});
});
app.service('ForecastingTimeResults', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/forecast', {});
});


//regression
app.service('RegressionLinear', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/linear', {});
});
app.service('RegressionRandomForest', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/randomforestregression', {});
});
app.service('RegressionXGBoost', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/xgboost', {});
});

//--general
app.service('RegressionLinearTimeGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/generallinear', {});
});
app.service('RegressionRandomForestTimeGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/generalrandomforestregression', {});
});
app.service('RegressionXGBoostTimeGeneral', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/generalxgboost', {});
});

//--evaluation
app.service('RegressionLinearTimeEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/evaluationlinear', {});
});
app.service('RegressionRandomForestTimeEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/evaluationrandomforestregression', {});
});
app.service('RegressionXGBoostTimeEvaluation', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'regression/evaluationxgboost', {});
});



//---------------workload predictions------------------------//
//############### time series ##########################//
//encoding
app.service('ForecastingArmaLoad', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/workload', {});
});

app.service('ForecastingArmaResources', function ($resource, PredictionLink) {
  return $resource(PredictionLink.link+'forecasting/resources', {});
});


//---------------acitivity predictions------------------------//
app.service('ClassificationDecisionTree', function ($resource, ClassificationLink) {
  return $resource(ClassificationLink.link+'classify/dt', {});
});

app.service('ClassificationRandomForest', function ($resource, ClassificationLink) {
  return $resource(ClassificationLink.link+'classify/rf', {});
});

app.service('ClassificationKNN', function ($resource, ClassificationLink) {
  return $resource(ClassificationLink.link+'classify/knn', {});
});

//---------------classification predictions------------------------//