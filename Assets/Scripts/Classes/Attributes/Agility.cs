using System;

namespace Attribute
{
	public class Agility : Attribute
	{
		private Benefit movespeed;
		private Benefit stamina_regen;

		public Agility () : base()
		{
			movespeed = new Benefit ();
			stamina_regen = new Benefit ();
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p)
		{
			base.AddPoints (p);
		}

		protected override void GetBenefitsFromPoints ()
		{
			float p = base.Points ();
			movespeed.SetBase (Calculate._movespeed (p));
			stamina_regen.SetBase (Calculate._staminaRegen (p));
		}
		
		#endregion

		#region Getters
		
		public float Movespeed ()
		{
			return movespeed.Value ();
		}

		public float StaminaRegen ()
		{
			return stamina_regen.Value ();
		}
		
		#endregion

		#region Setters and Mutators
		
		public void AddMovespeedBase (float b)
		{
			movespeed.AddBase (b);
		}

		public void AddMovespeedModifier (float m)
		{
			movespeed.AddModifier (m);
		}

		public void AddStaminaRegenBase (float b)
		{
			stamina_regen.AddBase (b);
		}

		public void AddStaminaRegenModifier (float m)
		{
			stamina_regen.AddModifier (m);
		}
		
		#endregion
	}
}

