using System;

namespace Attribute
{
	public class Energy : Attribute
	{
		private Benefit max_stamina;
		private Benefit stamina_regen;
		
		public Energy () : base()
		{
			max_stamina = new Benefit ();
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
			max_stamina.SetBase (Calculate._maxStamina (p));
			stamina_regen.SetBase (Calculate._staminaRegen (p));
		}
		
		#endregion
		
		#region Getters
		
		public float _MaxStamina ()
		{
			return max_stamina.Value ();
		}
		
		public float _StaminaRegen ()
		{
			return stamina_regen.Value ();
		}
		
		#endregion
		
		#region Setters and Mutators
		
		public void AddTo_MaxStamina_Base (float b)
		{
			max_stamina.AddTo_Base (b);
		}
		
		public void AddTo_MaxStamina_Modifier (float m)
		{
			max_stamina.AddTo_Modifier (m);
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

