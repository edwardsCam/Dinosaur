using System;

/*

Attribute.cs

...Base class for all attributes. Contains a point value, and a bonus that can only come from Intelligence.

*/

namespace Attribute
{
	public abstract class Attribute
	{
		private float base_points;
		private float intel_bonus;

		public Attribute ()
		{
			base_points = 1f;
			intel_bonus = 0f;
		}

		protected float Points ()
		{
			return base_points + intel_bonus;
		}

		protected float IntelBonus ()
		{
			return intel_bonus;
		}

		protected void AddPoints (float p, bool intel)
		{
			if (intel) {
				intel_bonus += p;
			} else {
				base_points += p;
			}
			GetBenefitsFromPoints ();
		}

		protected abstract void GetBenefitsFromPoints ();
	}
}

