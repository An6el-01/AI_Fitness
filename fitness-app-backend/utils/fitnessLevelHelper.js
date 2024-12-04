/**
 * Determines the user's fitness level based on BMI, activity frequency, activty intentsity
 * and self-asessed experience.
 * @param {number} age, users current age
 * @param {number} weight, users current weight
 * @param {number} height, height in meters
 * @param {number} activityFrequency - Number of exercise sessions per week. 
 * @param {string} activityIntensity = "light", "moderate", or "vigorous". 
 * @param {string} experience - "Beginner", "Intermediate" or "Advanced". 
 */

function determineFitnessLevel(
    age, 
    weight, 
    height, 
    activityFrequency, 
    activityIntensity, 
    experience) 
{
    const bmi = weight / ((height / 100) ** 2);
    let fitnessScore = 0;

    //Age Factor
    if (age < 20) {
        fitnessScore += 2;
    }else if (age >= 20 && age <= 35){
        fitnessScore += 1;
    }else if (age > 35 && age <= 50){
        fitnessScore += 0;
    }else{
        fitnessScore -= 1;
    }

    //BMI Factor
    if (bmi < 18.5){
        fitnessScore -= 1; //Underweight
    }else if (bmi >= 18.5 && bmi < 25){
        fitnessScore += 2; //Normal weight
    }else if (bmi >= 25 && bmi < 30){
        fitnessScore += 1; //Overweight
    }else {
        fitnessScore -= 1; //Obese
    }

    //Activity Frequency Factor
   if(activityFrequency >= 5){
    fitnessScore += 2; // Highly Active
   }else if (activityFrequency >= 3){
    fitnessScore += 1; // Moderately Active
   } else {
    fitnessScore -= 1; // Low Activity
   }
   
   //Activity Intensity Factor
    switch (activityIntensity) {
        case "vigorous":
            fitnessScore += 2;
            break;
        case "moderate":
            fitnessScore += 1;
            break;
        case "light":
            fitnessScore -= 1;
            break;
        default:
            fitnessScore -= 1; //Penalize for no intensity provided
            break;
    }

    // Self-assessed experience factor
    switch (experience.toLowerCase()) {
        case "advanced":
            fitnessScore +=2;
            break;
        case "intermediate":
            fitnessScore += 1;
            break;
        case "beginner":
            fitnessScore += 0;
            break;
        default:
            fitnessScore -= 1; //Penalize for no experience provided
            break;
    }

    //Determine Fitness Level based on total score
    if (fitnessScore >= 8) {
        return "Advanced";
    } else if (fitnessScore >= 4){
        return "Intermediate"
    } else {
        return "Beginner";
    }
}

module.exports = { determineFitnessLevel };