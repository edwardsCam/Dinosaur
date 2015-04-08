using UnityEngine;
using System.Collections;
using Assets.Scripts.AI.Allosaurus;

namespace Assets.Scripts.AI
{
	class DinoAI : MonoBehaviour
	{
		protected IDecision intelligence;
		GameObject target = null;

		public void Start ()
		{
			switch (gameObject.GetComponent<DinosaurObjectGetter> ().type ()) {

			case DinosaurType.Allosaurus:
				intelligence = new AllosaurusIdle ();
				break;

			}
		}
        
		void Update ()
		{
			intelligence.Decide (gameObject, target);
			intelligence.Act (gameObject, target);
		}

		public void UpdateDecision (IDecision choice)
		{
			intelligence = choice;
		}

		public IDecision getNextDecision()
		{
			return null;
		}
	}
}
