using UnityEngine; 
using System.Collections; 
using Assets.Scripts.AI.Allosaurus; 




namespace Assets.Scripts.AI 
{ 
	public abstract class DinoAI : MonoBehaviour 
	{
		public float stopDistance = 10; 
 		protected NavMeshAgent navAgent; 
 		protected Dinosaur me; 
 		protected GameObject curTarget = null; 
 		protected IDecision intelligence; 
 		GameObject target = null; 
 
 		public void Start () 
 		{ 
 			switch (gameObject.GetComponent<DinosaurObjectGetter> ().type ()) { 
 
 			case DinosaurType.Allosaurus: 
 				intelligence = new AllosaurusIdle (); 
 				break; 
 
 			case DinosaurType.PassiveAllosaurus: 
 				intelligence = new PassiveAllosaurus.PassiveAllosaurusIdle (); 
 				break; 
            case DinosaurType.Triceratops:
                intelligence = new Triceratops.TriceratopsIdle();
                break;
 			//TODO more AI's! 
 			} 
 
 			navAgent = gameObject.GetComponent<NavMeshAgent> (); 
 			me = gameObject.GetComponent<DinosaurObjectGetter> ().dinosaur (); 
 			navAgent.speed = me._Movespeed (); 
 			navAgent.stoppingDistance = me.Attack_Radius (); 
 		} 
          
 		void Update () 
 		{ 
 			if (me.Is_Alive ()) { 
 				intelligence.Decide (gameObject, target); 
 				intelligence.Act (gameObject, target); 
 			} 
 		} 
 
 		public void UpdateDecision () 
 		{ 
 			intelligence = getNextDecision (); 
 		} 
 
 		protected abstract IDecision getNextDecision (); 
 		protected abstract IDecision defaultDecision (); 
 
 		public GameObject GetNewTarget () 
 		{ 
 			int layer = 1 << 8; 
 			Collider[] hitColliders = Physics.OverlapSphere (gameObject.transform.position, me._DetectRadius (), layer); 
 			foreach (Collider otherObject in hitColliders) { 
 				if (otherObject.gameObject != gameObject) { 
 					return otherObject.gameObject; 
 				} 
 			} 
 			return null; 
 		} 
 
 		public Dinosaur getDinosaur () 
 		{ 
 			return me; 
 		} 

 		public NavMeshAgent getNavAgent () 
 		{ 
 			return navAgent; 
 		} 

 		public void setTarget (GameObject newTarget) 
 		{ 
 			curTarget = newTarget; 
 		} 

 		public GameObject getTarget () 
 		{ 
 			return curTarget; 
 		} 
 	} 
 } 
