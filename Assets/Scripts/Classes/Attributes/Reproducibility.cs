using System;

namespace Attribute
{
	public class Reproducibility : Attribute
	{
		
		public Reproducibility () : base()
		{
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p)
		{
			base.AddPoints (p);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			
		}
		
		#endregion
	}
}

