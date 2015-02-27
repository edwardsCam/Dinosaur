using UnityEngine;
using System.Collections;

public class DinoController : MonoBehaviour
{
	private Dinosaur me;
	private CharacterMotor motor;
	private Camera cam;

	private bool zooming_enabled = true;
	#region Zoom Variables
	public float zoomTime = 0.35f;
	private float normalFOV;
	private float minFOV;
	private float maxFOV;
	private float zoomCount = 0f;
	private float zoomInc;
	private int zoomState = 0;
	private int nextZoomState = 0;
	private bool zooming = false;
	#endregion
	
	void Start ()
	{
		me = new Dinosaur ();
		motor = GetComponent<CharacterMotor> ();
		cam = GameObject.FindWithTag ("MainCamera").camera;
		normalFOV = cam.fieldOfView;

		//******************
		//TODO placeholder
		{
			//me.AddPointsTo_Agility (10);
			//me.AddPointsTo_Sensory (5);
			me.AddPointsTo_Intelligence (10);

		}
		//******************

		update_speed ();
		update_visibility ();
	}

	// Update is called once per frame
	void Update ()
	{
		if (zooming_enabled)
			zoom (Time.deltaTime);
	}

	#region Camera and Motor Update functions

	void update_speed ()
	{
		float speed = me.Movespeed ();
		motor.movement.maxForwardSpeed = speed;
		motor.movement.maxSidewaysSpeed = speed * 0.85f;
		motor.movement.maxBackwardsSpeed = speed * 0.75f;
	}

	void update_visibility ()
	{
		minFOV = me.MinFieldOfView ();
		maxFOV = me.MaxFieldOfView ();
		cam.farClipPlane = me.VisibilityDistance ();
	}

	#endregion

	#region Zoom Functions 

	void zoom (float delta)
	{
		setZoomState ();
		inc_zoom (delta);
	}

	void setZoomState ()
	{
		float scroll = Input.GetAxis ("Mouse ScrollWheel");
		if (scroll != 0f && !zooming) {
			if (scroll > 0f) {
				if (zoomState == 0) 
					nextZoomState = 1;
				else if (zoomState == -1) 
					nextZoomState = 0;
			} else {
				if (zoomState == 0) 
					nextZoomState = -1;
				else if (zoomState == 1)
					nextZoomState = 0;
			}
			zooming = true;
		}
	}


	void inc_zoom (float delta)
	{
		if (zooming) {
			if (zoomState == -1) {
				if (nextZoomState == 0) {
					zoomInc = delta * (normalFOV - maxFOV) / zoomTime;
				}
			} else if (zoomState == 0) {
				if (nextZoomState == -1) {
					zoomInc = delta * (maxFOV - normalFOV) / zoomTime;
				} else if (nextZoomState == 1) {
					zoomInc = delta * (minFOV - normalFOV) / zoomTime;
				}
			} else if (nextZoomState == 0) {
				zoomInc = delta * (normalFOV - minFOV) / zoomTime;
			}
			cam.fieldOfView += zoomInc;
			if ((zoomCount += delta) > zoomTime) {
				resetZoom ();
			}
		}
	}

	void resetZoom ()
	{
		zoomCount = 0f;
		zoomInc = 0f;
		zooming = false;
		zoomState = nextZoomState;
		
		if (zoomState == 1)
			cam.fieldOfView = minFOV;
		else if (zoomState == 0)
			cam.fieldOfView = normalFOV;
		else if (zoomState == -1)
			cam.fieldOfView = maxFOV;
	}

	#endregion
}
