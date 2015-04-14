using UnityEngine;

public class Healing : MonoBehaviour
{

	private Dinosaur me;
	
	void Start ()
	{
		me = gameObject.GetComponent<DinosaurObjectGetter> ().dinosaur ();
	}

	void Update ()
	{
		me.Heal (Time.deltaTime);
	}
}
