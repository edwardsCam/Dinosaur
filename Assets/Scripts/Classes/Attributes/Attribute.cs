using System;

/*

Attribute.cs

...Base class for all attributes. Only contains a point value.

*/

namespace Attribute
{
	public abstract class Attribute
	{
		private float points;

		public Attribute ()
		{
			points = 1.0f;
		}

		protected float Points ()
		{
			return points;
		}

		protected void AddPoints (float p)
		{
			points += p;
			GetBenefitsFromPoints ();
		}

		protected abstract void GetBenefitsFromPoints ();
	}
}

