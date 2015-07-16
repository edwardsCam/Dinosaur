using UnityEngine;
using System.Collections;

public class CameraRotation : MonoBehaviour {

    public Vector3 axis = new Vector3();
    public float angle = 0;

	void Start () {}
	
	void Update () 
    {
        transform.Rotate(axis, angle*Time.deltaTime);
	}
}
