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
		
		public void Add (float p, bool is_intel_bonus)
		{
			base.AddPoints (p, is_intel_bonus);
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
		
		public void AddTo_Movespeed_Base (float b)
		{
			movespeed.AddTo_Base (b);
		}

		public void AddTo_Movespeed_Modifier (float m)
		{
			movespeed.AddTo_Modifier (m);
		}

		public void AddTo_StaminaRegen_Base (float b)
		{
			stamina_regen.AddTo_Base (b);
		}

		public void AddTo_StaminaRegen_Modifier (float m)
		{
			stamina_regen.AddTo_Modifier (m);
		}
		
		#endregion
	}
}

