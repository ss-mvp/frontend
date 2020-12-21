import React from 'react';
import { FaCircle, FaRegCircle } from 'react-icons/fa';
import NavArrowButton, { NavDirection } from '../NavArrowButton';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const numberOfSteps = 4;

const RenderSteps = (props: RenderStepsProps): React.ReactElement => {
  const currentStep = () => {
    switch (props.stepNum) {
      case 1:
        return (
          <Step1 buttonNavX={props.buttonNavX} buttonNavY={props.buttonNavY} />
        );
      case 2:
        return (
          <Step2 buttonNavX={props.buttonNavX} buttonNavY={props.buttonNavY} />
        );
      case 3:
        return (
          <Step3 buttonNavX={props.buttonNavX} buttonNavY={props.buttonNavY} />
        );
      case 4:
        return (
          <Step4 buttonNavX={props.buttonNavX} buttonNavY={props.buttonNavY} />
        );
      default:
        return <StepError />;
    }
  };

  const circles = () => {
    const circles = [...new Array(numberOfSteps)].map((x, i) => {
      if (i + 1 === props.stepNum) return <FaCircle key={i} />;
      else return <FaRegCircle key={i} />;
    });
    return <div className="circles">{circles.map((c) => c)}</div>;
  };

  return (
    <div className="steps">
      {/* Step-by-step instructions go here! Should render based off of stepNum */}
      {currentStep()}
      {circles()}
    </div>
  );
};

const StepError = (): React.ReactElement => {
  return (
    <div className="error">
      There was an error loading the game steps. Please try again!
    </div>
  );
};

interface RenderStepsProps {
  stepNum: number;
  buttonNavX: (direction: NavDirection) => void;
  buttonNavY: (direction: NavDirection) => void;
}

export interface StepProps {
  buttonNavX: (direction: NavDirection) => void;
  buttonNavY: (direction: NavDirection) => void;
}

export default RenderSteps;
