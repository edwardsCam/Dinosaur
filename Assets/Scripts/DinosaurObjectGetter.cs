using UnityEngine;
using System.Collections;

public class DinosaurObjectGetter : MonoBehaviour
{

	private Dinosaur d;
	public Assets.Scripts.DinosaurType species;

	// Use this for initialization
	void Awake ()
	{
		switch (species) {
		case Assets.Scripts.DinosaurType.Raptor:
			d = new Species.Velociraptor ();
			break;
		case Assets.Scripts.DinosaurType.TRex:
			d = new Species.TRex ();
			break;
		case Assets.Scripts.DinosaurType.Allosaurus:
			d = new Species.Allosaurus ();
			break;
		}
	}

	public Dinosaur dinosaur ()
	{
		return d;
	}

	public Assets.Scripts.DinosaurType type ()
	{
		return species;
	}
}
