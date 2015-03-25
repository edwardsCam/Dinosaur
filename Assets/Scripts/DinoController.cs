using UnityEngine;
using System.Collections;

public class DinoController : MonoBehaviour
{
	private Dinosaur me;
	private CharacterMotor motor;
	private Camera cam;

	public Assets.Scripts.DinosaurType species;

	#region Zoom Variables
	private bool zooming_enabled = true;
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
	#region Attack Variables
	private bool hit_attack_key = false;
	private bool attack_is_cooling_down = false;
	private bool has_enemy_in_range;
	private float attack_cooldown = 0.5f;
	private float attack_timer = 0f;
	#endregion
	
	void Start ()
	{
		if (species == Assets.Scripts.DinosaurType.TRex) {
			me = new Species.TRex ();
		} else if (species == Assets.Scripts.DinosaurType.Raptor) {
			me = new Species.Velociraptor ();
		} else {
			me = new Dinosaur ();
		}

		motor = GetComponent<CharacterMotor> ();
		cam = GameObject.FindWithTag ("MainCamera").GetComponent<Camera> ();
		normalFOV = cam.fieldOfView;

		update_speed ();
		update_visibility ();
	}

	// Update is called once per frame
	void Update ()
	{
		GatherInput ();
		UpdateGameLogic (Time.deltaTime);
		Render ();
	}

	void GatherInput ()
	{
		if (zooming_enabled && !zooming) {
			setZoomState ();
		}
		checkForAttack ();
	}

	void UpdateGameLogic (float delta)
	{
		if (me.FLAG_movespeed_changed) {
			update_speed ();
			me.FLAG_movespeed_changed = false;
		}
		if (me.FLAG_visibility_changed) {
			update_visibility ();
			me.FLAG_visibility_changed = false;
		}

		if (zooming_enabled && zooming) {
			inc_zoom (delta);
		}
		if (hit_attack_key) {
			hit_attack_key = false;
			Attack ();
		}
		if (attack_is_cooling_down) {
			attack_timer += delta;
			if (attack_timer > attack_cooldown) {
				attack_timer = 0f;
				attack_is_cooling_down = false;
			}
		}
		me.Heal (delta);
	}

	void Render ()
	{
		if (zooming_enabled) {
			cam.fieldOfView += zoomInc;
		}
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

	void setZoomState ()
	{
		float scroll = Input.GetAxis ("Mouse ScrollWheel");
		if (scroll != 0f) {
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
		zoomCount += delta;
		if (zoomCount > zoomTime) {
			resetZoom ();
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

	#region Attack Functions

	private void checkForAttack ()
	{
		if (Input.GetButton ("Fire1")) {
			hit_attack_key = true;
		}
	}

	private void Attack ()
	{
		if (!attack_is_cooling_down) {
			int layer = 1;
			layer <<= 8; //Dinosaur is layer 8
			Dinosaur enemy = null;
			Collider[] colliders = Physics.OverlapSphere (motor.transform.position, me.Attack_Radius (), layer);
			foreach (Collider c in colliders) {
				BasicWalkingScript ai_controller = c.GetComponent ("BasicWalkingScript") as BasicWalkingScript;
				if (ai_controller != null) {
					enemy = ai_controller.GetDinosaur ();
					break;
				}
			}
			me.Attack (enemy);
			attack_is_cooling_down = true;
		}
	}

	#endregion

	public Dinosaur GetDinosaur ()
	{
		return me;
	}
}
