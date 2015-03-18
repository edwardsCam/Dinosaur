namespace Species
{
	public class Spinosaurus : Dinosaur
	{
		public Spinosaurus () : base()
		{
			//these numbers are taken from https://docs.google.com/spreadsheets/d/1iFu6LpLsf9QlxIve1ivWTQ2Rtc8C55LqGwW69TnCPdY
			AddPointsTo_Strength (1);
			AddPointsTo_Agility (2);
			AddPointsTo_Energy (1);
			AddPointsTo_Sensory (1);
			AddPointsTo_Reproducibility (2);
			AddPointsTo_Survivability (1);
		}
	}
}

