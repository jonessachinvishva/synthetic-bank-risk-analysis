export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface MacroBaseline {
  date: string;
  bank_rate: number;
  cpi: number;
  gdp_growth: number;
  unemployment_rate: number;
  house_price_index: number;
  current_accounts: number;
  savings_accounts: number;
  mortgage_approvals: number;
  consumer_credit: number;
  credit_card_lending: number;
}

export interface HistoricalOverview {
  file: string;
  rows: number;
  columns: number;
  column_names: string[];
  date_range: { start: string; end: string };
  latest_macro: MacroBaseline;
}

export interface ModelInfo {
  key: string;
  target: string;
  display_name: string;
  model_type: string;
  features: string[];
  has_scaler: boolean;
  latest_lag_value: number | null;
  unit: string;
  feature_importance: Array<{
    feature: string;
    importance?: number;
    coefficient?: number;
    type: "importance" | "coefficient";
  }>;
  intercept: number | null;
}

export interface ModelEvaluation {
  key: string;
  model_name: string;
  target: string;
  r2: number;
  mae: number;
  rmse: number;
  train_obs: number;
  test_obs: number;
  series: Array<{
    date: string;
    actual: number;
    predicted: number;
    residual: number;
  }>;
}

export interface ScenarioPrediction {
  baseline: number;
  predicted: number;
  change_abs: number;
  change_pct: number;
  unit: string;
}

export interface ScenarioSimulationResult {
  inputs: {
    Bank_Rate: number;
    CPI: number;
    GDP_Growth: number;
    Unemployment_Rate: number;
    House_Price_Index: number;
  };
  regime: {
    difficult_economy_prob: number;
    economy_status: number;
    status_label: string;
  };
  predictions: {
    Current_Accounts: ScenarioPrediction;
    Savings_Accounts: ScenarioPrediction;
    Mortgage_Approvals: ScenarioPrediction;
    Consumer_Credit: ScenarioPrediction;
    Credit_Card_Lending: ScenarioPrediction;
  };
}
