using System;

namespace Attributes
{
	public class Intelligence : Attribute
	{
		
		public Intelligence () : base()
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

