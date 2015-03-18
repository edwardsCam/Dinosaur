using System;

public class Velociraptor : Dinosaur
{
	public Velociraptor () : base()
	{
		AddPointsTo_Agility (3);
		AddPointsTo_Sensory (1);
		AddPointsTo_Reproducibility (1);
		AddPointsTo_Intelligence (3);
	}
}