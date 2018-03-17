import * as React from "react";

import * as Utils from "../Utils";
import * as Units from "../Units";
import { NumberInput } from "../NumberInput";

export class InvestmentPeriod {
  public static Daily = new InvestmentPeriod(1, "Daily");
  public static Weekly = new InvestmentPeriod(7, "Weekly");
  public static Monthly = new InvestmentPeriod(30, "Monthly");
  public static Quarterly = new InvestmentPeriod(91, "Quarterly");
  public static SemiAnnual = new InvestmentPeriod(182, "Semi-annual");
  public static Annual = new InvestmentPeriod(365, "Annual");

  public static Values = [
    InvestmentPeriod.Daily,
    InvestmentPeriod.Weekly,
    InvestmentPeriod.Monthly,
    InvestmentPeriod.SemiAnnual,
    InvestmentPeriod.Annual
  ];

  public constructor(public numberOfDays: number, private asString: string) {}
  public toString(): string {
    return this.asString;
  }
}

export interface InvestmentCalculatorProps {}
export interface InvestmentCalculatorState {
  initialInvestment: number,
  contributionAmount: number,
  contributionPeriod: InvestmentPeriod,
  interestRate: number,
  compoundingPeriod: InvestmentPeriod,
  investmentLengthInYears: number
}

export class InvestmentCalculator extends React.Component<InvestmentCalculatorProps, InvestmentCalculatorState> {
  constructor(props: InvestmentCalculatorProps) {
    super(props);

    this.state = {
      initialInvestment: 1,
      contributionAmount: 1,
      contributionPeriod: InvestmentPeriod.Annual,
      interestRate: 0.1,
      compoundingPeriod: InvestmentPeriod.Annual,
      investmentLengthInYears: 10
    };
  }

  onInitialInvestmentChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    this.setState({ initialInvestment: newValue });
  }
  onContributionAmountChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    this.setState({ contributionAmount: newValue });
  }
  onContributionPeriodChange(event: any) {
    let investmentPeriod = InvestmentPeriod.Values.find(period => period.toString() === event.target.value);

    if (investmentPeriod) {
      this.setState({ contributionPeriod: investmentPeriod });
    }
  }
  onInterestRateChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    this.setState({ interestRate: newValue / 100 });
  }
  onInvestmentLengthInYearsChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    this.setState({ investmentLengthInYears: newValue });
  }

  calcResult(disableCompounding: boolean = false): number {
    const investmentLengthInDays = this.state.investmentLengthInYears * Units.daysInYear;

    let balance = this.state.initialInvestment;

    for(let i = 1; i <= investmentLengthInDays; i++) {
      InvestmentPeriod.Values.forEach(period => {
        if ((i % period.numberOfDays) == 0) {
          if(!disableCompounding) {
            if(this.state.compoundingPeriod === period) {
              balance *= (1 + this.state.interestRate);
            }
          }
          
          if(this.state.contributionPeriod === period) {
            balance += this.state.contributionAmount;
          }
        }
      });
    }

    return balance;
  }

  render(): JSX.Element {
    return (
      <div>
        <div>
          <span>Initial Principal</span>
          <NumberInput value={this.state.initialInvestment} onChange={this.onInitialInvestmentChange.bind(this)} showSlider={false} />
        </div>

        <div>
          <span>Contribution Amount</span>
          <NumberInput value={this.state.contributionAmount} onChange={this.onContributionAmountChange.bind(this)} showSlider={false} />
        </div>

        <div>
          <span>Contribution Period</span>
          <select value={this.state.contributionPeriod.toString()} onChange={this.onContributionPeriodChange.bind(this)}>
            {InvestmentPeriod.Values.map(period => <option value={period.toString()}>{period.toString()}</option>)}
          </select>
        </div>

        <div>
          <span>Interest Rate</span>
          <NumberInput value={100 * this.state.interestRate} onChange={this.onInterestRateChange.bind(this)} showSlider={false} />
        </div>

        <div>
          <span>Investment Length In Years</span>
          <NumberInput value={this.state.investmentLengthInYears} onChange={this.onInvestmentLengthInYearsChange.bind(this)} showSlider={false} />
        </div>

        <p>${this.calcResult().toFixed(2)}</p>
        <p>${this.calcResult(true).toFixed(2)}</p>
      </div>
    );
  }
}